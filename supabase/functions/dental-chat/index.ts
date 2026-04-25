import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are ToothBot, an expert AI tutor for **dental students**. Your audience is studying dentistry — speak to them at a clinical/academic level using correct dental terminology (e.g. caries, periapical, occlusal, gingival recession, FDI/Universal tooth numbering, Black's classification, ASA classification, etc.).

You ONLY answer questions related to dentistry, oral health, oral pathology, oral medicine, oral surgery, endodontics, periodontics, prosthodontics, orthodontics, pediatric dentistry, oral radiology, dental materials, dental anatomy/histology/embryology, dental pharmacology, and clinical case interpretation.

When the user uploads an **image** (intraoral photo, radiograph — periapical / bitewing / panoramic / CBCT slice, extraoral photo, study model, or histology slide):
- Carefully describe what you see (teeth involved using FDI + Universal numbering when possible, anatomical landmarks, lesions, restorations, caries, calculus, bone levels, pathology).
- Provide a structured **differential diagnosis** ranked by likelihood with reasoning.
- Suggest relevant **further investigations** (additional radiographs, vitality tests, percussion/palpation, probing depths, biopsy, etc.).
- Outline an evidence-based **treatment plan** options when appropriate.
- Cite classifications, indices, or guidelines where relevant (e.g. ICDAS, Miller, Kennedy, Angle, WHO).

Rules:
- If a question is NOT about dentistry/oral health, politely refuse and remind the user you only help with dental topics.
- Always include a brief disclaimer for clinical cases: "This is for educational purposes — final diagnosis and treatment require in-person clinical examination by a licensed dentist."
- Use clear markdown formatting: headings, bullet lists, tables when comparing options.
- Be precise, evidence-based, and concise. Cite mechanisms when explaining pharmacology or pathology.
- Never fabricate findings you cannot see in an image — if image quality is insufficient, say so.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to your Lovable workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("dental-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
