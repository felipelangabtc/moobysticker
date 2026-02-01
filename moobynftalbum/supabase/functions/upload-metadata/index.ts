import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StickerMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  external_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PINATA_API_KEY = Deno.env.get('PINATA_API_KEY');
    const PINATA_SECRET_KEY = Deno.env.get('PINATA_SECRET_KEY');

    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata credentials not configured');
    }

    const { action, data } = await req.json();
    console.log('Action:', action);

    if (action === 'upload-json') {
      // Upload metadata JSON to IPFS
      const { metadata, name } = data as { metadata: StickerMetadata; name: string };
      
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: { name },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Pinata error:', error);
        throw new Error(`Pinata upload failed: ${error}`);
      }

      const result = await response.json();
      console.log('Uploaded to IPFS:', result.IpfsHash);

      return new Response(JSON.stringify({
        success: true,
        ipfsHash: result.IpfsHash,
        url: `ipfs://${result.IpfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'upload-image') {
      // Upload image file to IPFS
      const { imageBase64, fileName, mimeType } = data as { 
        imageBase64: string; 
        fileName: string;
        mimeType: string;
      };

      // Convert base64 to blob
      const imageBytes = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
      
      const formData = new FormData();
      formData.append('file', new Blob([imageBytes], { type: mimeType }), fileName);
      formData.append('pinataMetadata', JSON.stringify({ name: fileName }));

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Pinata error:', error);
        throw new Error(`Pinata upload failed: ${error}`);
      }

      const result = await response.json();
      console.log('Image uploaded to IPFS:', result.IpfsHash);

      return new Response(JSON.stringify({
        success: true,
        ipfsHash: result.IpfsHash,
        url: `ipfs://${result.IpfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'upload-batch') {
      // Upload multiple metadata files for stickers
      const { stickers } = data as { stickers: { id: number; metadata: StickerMetadata }[] };
      const results: { id: number; ipfsHash: string }[] = [];

      for (const sticker of stickers) {
        const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_KEY,
          },
          body: JSON.stringify({
            pinataContent: sticker.metadata,
            pinataMetadata: { name: `sticker-${sticker.id}.json` },
          }),
        });

        if (response.ok) {
          const result = await response.json();
          results.push({ id: sticker.id, ipfsHash: result.IpfsHash });
          console.log(`Sticker ${sticker.id} uploaded: ${result.IpfsHash}`);
        } else {
          console.error(`Failed to upload sticker ${sticker.id}`);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        uploaded: results.length,
        total: stickers.length,
        results,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
