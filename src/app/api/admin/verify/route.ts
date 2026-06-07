export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/kv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode, action, content } = body;

    const correctPasscode = process.env.ADMIN_PASSCODE;

    if (!correctPasscode) {
      return NextResponse.json(
        { error: "Admin passcode not configured" },
        { status: 500 }
      );
    }

    if (passcode !== correctPasscode) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    // SAVE content to Upstash Redis
    if (action === "save" && content) {
      await redis.set("site_content", JSON.stringify(content));
      return NextResponse.json({ success: true, saved: true }, { status: 200 });
    }

    // LOAD content from Upstash Redis
    if (action === "load") {
      const saved = await redis.get<string>("site_content");
      return NextResponse.json(
        { success: true, content: saved ? JSON.parse(saved) : null },
        { status: 200 }
      );
    }

    // Just verify passcode
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
