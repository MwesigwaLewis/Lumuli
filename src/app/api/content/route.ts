import { NextResponse } from "next/server";
import { redis } from "@/lib/kv";

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const saved = await redis.get<string>("site_content");
    if (saved) {
      return NextResponse.json(JSON.parse(saved), { status: 200 });
    }
    // Return default if nothing saved yet
    return NextResponse.json({
      heroTitle: "Lumuli Andrew",
      heroSubtitle: "A youth leader, strategic thinker, and fashion enthusiast passionate about faith-centered service, youth empowerment, and personal development.",
      aboutText: "I am a youth leader, strategic thinker, and fashion enthusiast based in Uganda. My journey is driven by a deep passion for faith-centered service, youth empowerment, personal development, and staying informed about evolving fashion trends and contemporary culture. I believe in the power of community, the importance of mentorship, and the impact of strategic thinking in solving real-world challenges. Whether it's leading youth programs, analyzing fashion trends, or playing chess, I approach every endeavor with dedication and purpose.",
      email: "andrewlumuli7@gmail.com",
      location: "Kampala, Uganda",
    }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}
