import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function extractTextFromBase64(base64: string, fileName: string): string {
  // Decode base64 to bytes
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const decoder = new TextDecoder("utf-8", { fatal: false });

  if (fileName.endsWith(".pdf")) {
    // Basic PDF text extraction — pull text between stream/endstream and BT/ET blocks
    const raw = decoder.decode(bytes);
    const textParts: string[] = [];

    // Extract text from PDF content streams
    const streamRegex = /stream\r?\n([\s\S]*?)endstream/g;
    let match;
    while ((match = streamRegex.exec(raw)) !== null) {
      const content = match[1];
      // Extract text between parentheses in Tj/TJ operators
      const tjRegex = /\(([^)]*)\)/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(content)) !== null) {
        const text = tjMatch[1]
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\\(/g, "(")
          .replace(/\\\)/g, ")")
          .replace(/\\\\/g, "\\");
        if (text.trim()) textParts.push(text);
      }
    }

    if (textParts.length > 0) return textParts.join(" ");

    // Fallback: extract any readable ASCII from the raw content
    const readable = raw.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
    // Filter out PDF structural content
    const lines = readable.split(" ").filter(
      (w) =>
        w.length > 2 &&
        !w.startsWith("/") &&
        !w.match(/^[0-9]+$/) &&
        !w.match(/^(obj|endobj|stream|endstream|xref|trailer|startxref)$/)
    );
    return lines.join(" ").substring(0, 10000);
  }

  if (fileName.endsWith(".docx")) {
    // DOCX is a ZIP containing XML — extract text from word/document.xml
    const raw = decoder.decode(bytes);
    // Find text between <w:t> tags
    const textParts: string[] = [];
    const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
    while ((match = wtRegex.exec(raw)) !== null) {
      if (match[1].trim()) textParts.push(match[1]);
    }
    if (textParts.length > 0) return textParts.join(" ");
    // Fallback
    return raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 10000);
  }

  return decoder.decode(bytes).substring(0, 10000);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeBase64, fileName, jobDescription } = await req.json();

    if (!resumeBase64 || !fileName || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract text from the resume
    const resumeText = extractTextFromBase64(resumeBase64, fileName);

    if (resumeText.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Could not extract enough text from the resume. Please try a different file or a text-based PDF." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert resume analyst and ATS (Applicant Tracking System) specialist. Analyze the provided resume text against the job description and return a structured JSON response.

You MUST respond with ONLY valid JSON matching this exact schema:
{
  "matchScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "keywords": [
    {"keyword": "string", "inResume": boolean, "inJD": boolean, "importance": "high"|"medium"|"low"}
  ],
  "suggestions": [
    {"title": "string", "description": "string", "example": "optional string with a rewritten bullet point or suggestion"}
  ],
  "atsTips": ["tip1", "tip2", ...]
}

Guidelines:
- matchScore: Overall match percentage based on skills, experience, and keyword alignment
- atsScore: How well the resume would pass through ATS systems (formatting, keywords, structure)
- matchedSkills: Skills/technologies found in BOTH the resume and JD
- missingSkills: Important skills in the JD that are NOT in the resume
- keywords: Top 10-15 most important keywords from the JD with their presence status
- suggestions: 3-6 actionable improvements, each with a specific example or rewritten bullet point
- atsTips: 3-5 ATS-specific formatting/content tips

Be thorough and specific. Return ONLY the JSON object, no markdown formatting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `RESUME TEXT:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI analysis failed");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) throw new Error("No response from AI");

    // Parse the JSON response, stripping any markdown code fences
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
