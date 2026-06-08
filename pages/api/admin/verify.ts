import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/kv";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { passcode, action, content } = req.body;

    const correctPasscode = process.env.ADMIN_PASSCODE;

    if (!correctPasscode) {
      return res.status(500).json({ error: "Admin passcode not configured" });
    }

    if (passcode !== correctPasscode) {
      return res.status(401).json({ error: "Invalid passcode" });
    }

    if (action === "save" && content) {
      if (!redis) {
        return res.status(503).json({ error: "Database not available" });
      }
      await redis.set("site_content", JSON.stringify(content));
      return res.status(200).json({ success: true, saved: true });
    }

    if (action === "load") {
      if (!redis) {
        return res.status(503).json({ error: "Database not available" });
      }
      const saved = await redis.get<string>("site_content");
      return res.status(200).json({ success: true, content: saved ? JSON.parse(saved) : null });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(400).json({ error: "Invalid request" });
  }
}
