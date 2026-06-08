import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/kv";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { passcode, action, content, visibility, images } = req.body;
    const correctPasscode = process.env.ADMIN_PASSCODE;

    if (!correctPasscode) {
      return res.status(500).json({ error: "Admin passcode not configured" });
    }
    if (passcode !== correctPasscode) {
      return res.status(401).json({ error: "Invalid passcode" });
    }

    if (!redis) {
      return res.status(503).json({ error: "Database not available" });
    }

    if (action === "save" && content) {
      await redis.set("site_content", JSON.stringify(content));
      return res.status(200).json({ success: true, saved: true });
    }

    if (action === "saveVisibility" && visibility) {
      await redis.set("site_visibility", JSON.stringify(visibility));
      return res.status(200).json({ success: true, saved: true });
    }

    if (action === "saveImages" && images) {
      await redis.set("site_images", JSON.stringify(images));
      return res.status(200).json({ success: true, saved: true });
    }

    if (action === "load") {
      const savedContent = await redis.get<string>("site_content");
      const savedVisibility = await redis.get<string>("site_visibility");
      const savedImages = await redis.get<string>("site_images");
      return res.status(200).json({
        success: true,
        content: savedContent ? (typeof savedContent === "string" ? JSON.parse(savedContent) : savedContent) : null,
        visibility: savedVisibility ? (typeof savedVisibility === "string" ? JSON.parse(savedVisibility) : savedVisibility) : null,
        images: savedImages ? (typeof savedImages === "string" ? JSON.parse(savedImages) : savedImages) : null,
      });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json({ error: "Invalid request" });
  }
}
