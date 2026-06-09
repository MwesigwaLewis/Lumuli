import type { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false, // Required for blob streaming
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { searchParams } = new URL(req.url!, `http://${req.headers.host}`);
    const filename = searchParams.get("filename") || `image-${Date.now()}.jpg`;
    
    // Upload directly to Vercel Blob
    const blob = await put(filename, req, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ 
      success: true, 
      url: blob.url,
      pathname: blob.pathname 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
