import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/kv";

// 1. Centralized fallback data so you only update it once
const FALLBACK_PROFILE = {
  heroTitle: "Lumuli Andrew",
  heroSubtitle: "A youth leader, strategic thinker, and fashion enthusiast passionate about faith-centered service, youth empowerment, and personal development.",
  aboutText: "I am a youth leader, strategic thinker, and fashion enthusiast based in Uganda. My journey is driven by a deep passion for faith-centered service, youth empowerment, personal development, and staying informed about evolving fashion trends and contemporary culture. I believe in the power of community, the importance of mentorship, and the impact of strategic thinking in solving real-world challenges. Whether it's leading youth programs, analyzing fashion trends, or playing chess, I approach every endeavor with dedication and purpose.",
  email: "andrewlumuli7@gmail.com",
  location: "Kampala, Uganda",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enforce GET method
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (redis) {
      const saved = await redis.get<any>("site_content");
      if (saved) {
        // 2. Safe parsing check to protect against automatic object parsing
        const data = typeof saved === "string" ? JSON.parse(saved) : saved;
        return res.status(200).json(data);
      }
    }
    
    // Fallback if Redis is connected but the key doesn't exist
    return res.status(200).json(FALLBACK_PROFILE);
  } catch (error) {
    // Log the error internally so you actually know if Redis is breaking
    console.error("Redis fetch failed, serving fallback:", error);
    
    // Fallback if Redis connection times out or crashes
    return res.status(200).json(FALLBACK_PROFILE);
  }
}
