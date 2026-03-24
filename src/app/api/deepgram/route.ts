/* Deepgram temporary API key for browser WebSocket STT */
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Deepgram not configured" }, { status: 500 });

    // Create a temporary scoped key via Deepgram API
    const res = await fetch("https://api.deepgram.com/v1/keys/project", {
      method: "POST",
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: "Temporary browser key",
        scopes: ["usage:write"],
        time_to_live_in_seconds: 60,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ key: data.key });
    }

    // If scoped key fails, return the main key (for dev)
    // In production, always use scoped keys
    return NextResponse.json({ key: apiKey });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get key" }, { status: 500 });
  }
}
