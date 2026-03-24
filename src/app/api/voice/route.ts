/* ───────────────────────────────────────────────────────
   Resemble AI Voice Synthesis API
   POST /api/voice — Convert text to speech using Resemble AI
   Returns audio URL or audio data
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.RESEMBLE_API_KEY || "";
const PROJECT_UUID = process.env.RESEMBLE_PROJECT_UUID || "";
const VOICE_EN = process.env.RESEMBLE_VOICE_EN || process.env.RESEMBLE_DEFAULT_VOICE_UUID || "";
const VOICE_AR = process.env.RESEMBLE_VOICE_AR || "";

const RESEMBLE_BASE = "https://app.resemble.ai/api/v2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = "en" } = body;

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    if (!API_KEY || !PROJECT_UUID) {
      return NextResponse.json({ error: "Resemble AI not configured" }, { status: 500 });
    }

    const voiceUuid = language === "ar" ? VOICE_AR : VOICE_EN;

    // Create a clip via Resemble AI API
    const response = await fetch(`${RESEMBLE_BASE}/projects/${PROJECT_UUID}/clips`, {
      method: "POST",
      headers: {
        "Authorization": `Token token=${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `voice-${Date.now()}`,
        body: text,
        voice_uuid: voiceUuid,
        is_public: false,
        is_archived: false,
        raw: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resemble API error:", response.status, errorText);

      // Try the streaming/sync endpoint instead
      const syncResponse = await fetch(`${RESEMBLE_BASE}/projects/${PROJECT_UUID}/clips/sync`, {
        method: "POST",
        headers: {
          "Authorization": `Token token=${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: `<speak>${text}</speak>`,
          voice_uuid: voiceUuid,
          output_format: "mp3",
          sample_rate: 44100,
        }),
      });

      if (syncResponse.ok) {
        const syncData = await syncResponse.json();
        return NextResponse.json({
          success: true,
          audioUrl: syncData.item?.audio_src || syncData.audio_src || null,
          clipId: syncData.item?.uuid || null,
        });
      }

      return NextResponse.json({ error: "Voice synthesis failed", details: errorText }, { status: 500 });
    }

    const data = await response.json();
    const clip = data.item || data;

    // If clip is ready immediately (sync mode)
    if (clip.audio_src) {
      return NextResponse.json({
        success: true,
        audioUrl: clip.audio_src,
        clipId: clip.uuid,
        status: "ready",
      });
    }

    // Clip is processing — poll for completion
    const clipUuid = clip.uuid;
    if (clipUuid) {
      // Poll up to 10 times, 1 second apart
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 1000));

        const pollRes = await fetch(`${RESEMBLE_BASE}/projects/${PROJECT_UUID}/clips/${clipUuid}`, {
          headers: { "Authorization": `Token token=${API_KEY}` },
        });

        if (pollRes.ok) {
          const pollData = await pollRes.json();
          if (pollData.item?.audio_src) {
            return NextResponse.json({
              success: true,
              audioUrl: pollData.item.audio_src,
              clipId: clipUuid,
              status: "ready",
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        clipId: clipUuid,
        status: "processing",
        message: "Audio is still being generated. Check back shortly.",
      });
    }

    return NextResponse.json({ error: "No clip ID returned" }, { status: 500 });
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json({ error: "Voice synthesis failed" }, { status: 500 });
  }
}
