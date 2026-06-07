import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/kv";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const saved = await redis.get<string>("site_content");
    if (saved) {
      return res.status(200).json(JSON.parse(saved));
    }
    return res.status(200).json({
      heroTitle: "Lumuli Andrew",
      heroSubtitle: "A youth leader, strategic thinker, and fashion enthusiast passionate about faith-centered service, youth empowerment, and personal development.",
      aboutText: "I am a youth leader, strategic thinker, and fashion enthusiast based in Uganda. My journey is driven by a deep passion for faith-centered service, youth empowerment, personal development, and staying informed about evolving fashion trends and contemporary culture. I believe in the power of community, the importance of mentorship, and the impact of strategic thinking in solving real-world challenges. Whether it's leading youth programs, analyzing fashion trends, or playing chess, I approach every endeavor with dedication and purpose.",
      email: "andrewlumuli7@gmail.com",
      location: "Kampala, Uganda",
    });
  } catch {
    return res.status(500).json({ error: "Failed to load content" });
  }
}
