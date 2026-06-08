import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/kv";

const FALLBACK_PROFILE = {
  heroTitle: "Lumuli Andrew",
  heroSubtitle: "A youth leader, strategic thinker, and fashion enthusiast passionate about faith-centered service, youth empowerment, and personal development.",
  aboutText: "I am a youth leader, strategic thinker, and fashion enthusiast based in Uganda. My journey is driven by a deep passion for faith-centered service, youth empowerment, personal development, and staying informed about evolving fashion trends and contemporary culture. I believe in the power of community, the importance of mentorship, and the impact of strategic thinking in solving real-world challenges. Whether it's leading youth programs, analyzing fashion trends, or playing chess, I approach every endeavor with dedication and purpose.",
  email: "andrewlumuli@gmail.com",
  location: "Kampala, Uganda",
};

const FALLBACK_VISIBILITY = {
  focusAreas: true,
  skills: true,
  currentWork: true,
  contact: true,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let profile = FALLBACK_PROFILE;
    let visibility = FALLBACK_VISIBILITY;
    let images: Record<string, string> = {};

    if (redis) {
      const savedProfile = await redis.get<string>("site_content");
      if (savedProfile) {
        profile = typeof savedProfile === "string" ? JSON.parse(savedProfile) : savedProfile;
      }
      const savedVisibility = await redis.get<string>("site_visibility");
      if (savedVisibility) {
        visibility = typeof savedVisibility === "string" ? JSON.parse(savedVisibility) : savedVisibility;
      }
      const savedImages = await redis.get<string>("site_images");
      if (savedImages) {
        images = typeof savedImages === "string" ? JSON.parse(savedImages) : savedImages;
      }
    }

    return res.status(200).json({ profile, visibility, images });
  } catch (error) {
    console.error("Content API error:", error);
    return res.status(200).json({
      profile: FALLBACK_PROFILE,
      visibility: FALLBACK_VISIBILITY,
      images: {},
    });
  }
}
