// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MoobyStickers
 * @dev ERC-1155 NFT Sticker Album Contract
 * 
 * Token IDs:
 * - 1-300: Season 1 Stickers
 * - 1001-1050: OG Collection Stickers
 * 
 * Deploy this contract on Polygon Amoy (testnet) or Polygon Mainnet
 * 
 * HOW TO DEPLOY:
 * 1. Open Remix IDE (https://remix.ethereum.org)
 * 2. Create new file and paste this code
 * 3. Compile with Solidity 0.8.20+
 * 4. Deploy to Polygon Amoy using MetaMask
 * 5. Update CONTRACT_ADDRESS in src/config/contracts.ts
 */
contract MoobyStickers is ERC1155, Ownable, ERC1155Supply {
    using Strings for uint256;

    string public name = "Mooby Stickers Season 1";
    string public symbol = "MOOBY";
    
    // Base URI for metadata (IPFS via Pinata)
    string private _baseTokenURI;
    
    // Pack prices in POL (wei)
    uint256 public basicPackPrice = 0.001 ether;
    uint256 public silverPackPrice = 0.002 ether;
    uint256 public goldPackPrice = 0.005 ether;
    
    // Pack types
    uint8 public constant PACK_BASIC = 0;
    uint8 public constant PACK_SILVER = 1;
    uint8 public constant PACK_GOLD = 2;
    
    // Sticker ID ranges
    uint256 public constant SEASON1_START = 1;
    uint256 public constant SEASON1_END = 300;
    uint256 public constant OG_START = 1001;
    uint256 public constant OG_END = 1050;
    
    // OG NFT contract for holder verification
    address public ogNftContract;
    mapping(uint256 => bool) public ogTokenClaimed;
    
    // Events
    event PackPurchased(address indexed buyer, uint8 packType, uint256[] stickerIds);
    event OGPackClaimed(address indexed holder, uint256 tokenId, uint256[] stickerIds);
    event StickerMinted(address indexed to, uint256 stickerId, uint256 amount);
    
    constructor(string memory baseURI, address _ogNftContract) 
        ERC1155(baseURI) 
        Ownable(msg.sender) 
    {
        _baseTokenURI = baseURI;
        ogNftContract = _ogNftContract;
    }
    
    /**
     * @dev Returns the URI for a token ID
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }
    
    /**
     * @dev Buy a pack with POL
     * Note: In production, use Chainlink VRF for randomness
     */
    function buyPack(uint8 packType) external payable {
        uint256 price;
        uint256 stickerCount;
        
        if (packType == PACK_BASIC) {
            price = basicPackPrice;
            stickerCount = 3;
        } else if (packType == PACK_SILVER) {
            price = silverPackPrice;
            stickerCount = 5;
        } else if (packType == PACK_GOLD) {
            price = goldPackPrice;
            stickerCount = 7;
        } else {
            revert("Invalid pack type");
        }
        
        require(msg.value >= price, "Insufficient payment");
        
        // Generate pseudo-random sticker IDs (use VRF in production!)
        uint256[] memory stickerIds = _generateStickerIds(stickerCount, packType);
        
        // Mint stickers to buyer
        for (uint256 i = 0; i < stickerCount; i++) {
            _mint(msg.sender, stickerIds[i], 1, "");
        }
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit PackPurchased(msg.sender, packType, stickerIds);
    }
    
    /**
     * @dev Generate pseudo-random sticker IDs based on pack type
     * WARNING: This is NOT secure randomness! Use Chainlink VRF in production
     */
    function _generateStickerIds(uint256 count, uint8 packType) internal view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            uint256 seed = uint256(keccak256(abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                msg.sender,
                i,
                packType
            )));
            
            // Simple rarity logic based on pack type
            uint256 rarityRoll = seed % 100;
            uint256 stickerId;
            
            if (packType == PACK_GOLD && rarityRoll < 5) {
                // 5% legendary in gold pack (IDs 297-300)
                stickerId = 297 + (seed % 4);
            } else if (packType >= PACK_SILVER && rarityRoll < 20) {
                // 20% epic (IDs 226-296)
                stickerId = 226 + (seed % 71);
            } else if (rarityRoll < 50) {
                // 50% rare (IDs 101-225)
                stickerId = 101 + (seed % 125);
            } else {
                // Common (IDs 1-100)
                stickerId = 1 + (seed % 100);
            }
            
            ids[i] = stickerId;
        }
        
        return ids;
    }
    
    /**
     * @dev Claim OG pack (requires holding OG NFT)
     */
    function claimOGPack(uint256 ogTokenId) external {
        require(ogNftContract != address(0), "OG contract not set");
        require(!ogTokenClaimed[ogTokenId], "Already claimed for this token");
        
        // Verify ownership of OG NFT
        IERC721 ogNft = IERC721(ogNftContract);
        require(ogNft.ownerOf(ogTokenId) == msg.sender, "Not owner of OG token");
        
        ogTokenClaimed[ogTokenId] = true;
        
        // Generate 5 OG stickers
        uint256[] memory stickerIds = new uint256[](5);
        for (uint256 i = 0; i < 5; i++) {
            uint256 seed = uint256(keccak256(abi.encodePacked(
                block.timestamp,
                msg.sender,
                ogTokenId,
                i
            )));
            stickerIds[i] = OG_START + (seed % 50);
            _mint(msg.sender, stickerIds[i], 1, "");
        }
        
        emit OGPackClaimed(msg.sender, ogTokenId, stickerIds);
    }
    
    /**
     * @dev Admin mint function for airdrops
     */
    function adminMint(address to, uint256 id, uint256 amount) external onlyOwner {
        require(
            (id >= SEASON1_START && id <= SEASON1_END) || 
            (id >= OG_START && id <= OG_END),
            "Invalid sticker ID"
        );
        _mint(to, id, amount, "");
        emit StickerMinted(to, id, amount);
    }
    
    /**
     * @dev Batch mint for efficiency
     */
    function adminMintBatch(address to, uint256[] memory ids, uint256[] memory amounts) external onlyOwner {
        _mintBatch(to, ids, amounts, "");
    }
    
    /**
     * @dev Update base URI (for IPFS updates)
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }
    
    /**
     * @dev Update pack prices
     */
    function setPackPrices(uint256 basic, uint256 silver, uint256 gold) external onlyOwner {
        basicPackPrice = basic;
        silverPackPrice = silver;
        goldPackPrice = gold;
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev OpenSea collection-level metadata
     */
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked(_baseTokenURI, "collection.json"));
    }
    
    // Required overrides for ERC1155Supply
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}

// Interface for OG NFT contract verification
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
}
