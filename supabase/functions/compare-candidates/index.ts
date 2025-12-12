const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CandidateInput {
  id: string;
  name: string;
  position: string;
  email: string;
  ai_fit_score: number | null;
  ai_reasoning: string | null;
  ai_breakdown: any;
  details: any;
  interviews: {
    type: string;
    result: string;
    score: number;
    feedback: string;
  }[];
}

interface RankingResult {
  candidateId: string;
  candidateName: string;
  rank: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
}

interface ComparisonResult {
  ranking: RankingResult[];
  recommendation: string;
  summary: string;
  detailedAnalysis: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { candidates } = await req.json() as { candidates: CandidateInput[] };

    if (!candidates || candidates.length < 2) {
      return new Response(
        JSON.stringify({ error: "ต้องมีผู้สมัครอย่างน้อย 2 คน" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY");
    }

    // Build candidate profiles for comparison
    const candidateProfiles = candidates.map((c) => {
      const details = c.details || {};
      const interviews = c.interviews || [];

      // Get interview scores
      const preScreenInterview = interviews.find(i => i.type === 'pre_screen');
      const firstInterview = interviews.find(i => i.type === 'first_interview');
      const finalInterview = interviews.find(i => i.type === 'final_interview');

      return `
## ${c.name}
- ตำแหน่งที่สมัคร: ${c.position || 'ไม่ระบุ'}
- AI Fit Score: ${c.ai_fit_score || 'ไม่มี'}
- AI Reasoning: ${c.ai_reasoning || 'ไม่มี'}

### ข้อมูลส่วนตัว:
- อายุ: ${details.age || 'ไม่ระบุ'}
- เงินเดือนที่คาดหวัง: ${details.expected_salary ? `${details.expected_salary.toLocaleString()} บาท` : 'ไม่ระบุ'}
- ทักษะคอมพิวเตอร์: ${details.computer_skill ? 'มี' : 'ไม่มี'}
- ทักษะอื่นๆ: ${details.other_skills || 'ไม่ระบุ'}

### คะแนนทดสอบ:
- แบบทดสอบ HR: ${details.hr_test_score || 'ไม่มี'}
- แบบทดสอบแผนก: ${details.department_test_score || 'ไม่มี'}

### ผลการสัมภาษณ์:
- Pre-Screen: ${preScreenInterview ? `${preScreenInterview.result} - ${preScreenInterview.feedback || 'ไม่มี feedback'}` : 'ไม่มี'}
- First Interview: ${firstInterview ? `${firstInterview.result}, คะแนน ${firstInterview.score || 'ไม่มี'}/70 - ${firstInterview.feedback || 'ไม่มี feedback'}` : 'ไม่มี'}
- Final Interview: ${finalInterview ? `${finalInterview.result}, คะแนน ${finalInterview.score || 'ไม่มี'}/70 - ${finalInterview.feedback || 'ไม่มี feedback'}` : 'ไม่มี'}

### AI Score Breakdown:
${c.ai_breakdown ? JSON.stringify(c.ai_breakdown.breakdown || c.ai_breakdown, null, 2) : 'ไม่มี'}
`;
    }).join('\n---\n');

    const prompt = `คุณเป็นผู้เชี่ยวชาญด้าน HR และการสรรหาบุคลากร กรุณาวิเคราะห์และเปรียบเทียบผู้สมัครต่อไปนี้ เพื่อช่วยในการตัดสินใจเลือกผู้สมัครที่เหมาะสมที่สุดสำหรับตำแหน่งที่เปิดรับ

รายชื่อผู้สมัคร:
${candidateProfiles}

กรุณาวิเคราะห์และให้ผลลัพธ์ในรูปแบบ JSON ดังนี้:
{
  "ranking": [
    {
      "candidateId": "id ของผู้สมัคร",
      "candidateName": "ชื่อผู้สมัคร",
      "rank": 1,
      "overallScore": 85,
      "strengths": ["จุดแข็งข้อ 1", "จุดแข็งข้อ 2", "จุดแข็งข้อ 3"],
      "weaknesses": ["ข้อควรพิจารณาข้อ 1", "ข้อควรพิจารณาข้อ 2"]
    }
  ],
  "recommendation": "คำแนะนำโดยรวม ว่าควรเลือกใครและเพราะอะไร",
  "summary": "สรุปการเปรียบเทียบโดยภาพรวม",
  "detailedAnalysis": "การวิเคราะห์เชิงลึกเกี่ยวกับแต่ละคน"
}

หมายเหตุ:
- overallScore คือคะแนนรวมจากทุกด้าน (0-100)
- จัดอันดับตาม overallScore จากมากไปน้อย
- strengths และ weaknesses ควรมีอย่างน้อย 2-3 ข้อ
- พิจารณาจาก AI Fit Score, คะแนนทดสอบ, และผลการสัมภาษณ์
- ตอบเป็นภาษาไทย ยกเว้นชื่อที่เป็นภาษาอังกฤษ
- ตอบเฉพาะ JSON เท่านั้น ไม่ต้องมีคำอธิบายเพิ่มเติม`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "HTTP-Referer": "https://core-fit.vercel.app",
        "X-Title": "Core-Fit HR System",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let result: ComparisonResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw response:", content);

      // Create a fallback response based on AI scores
      const sortedCandidates = [...candidates].sort((a, b) =>
        (b.ai_fit_score || 0) - (a.ai_fit_score || 0)
      );

      result = {
        ranking: sortedCandidates.map((c, index) => ({
          candidateId: c.id,
          candidateName: c.name,
          rank: index + 1,
          overallScore: c.ai_fit_score || 0,
          strengths: ["มี AI Fit Score ที่ดี"],
          weaknesses: ["ต้องพิจารณาเพิ่มเติม"],
        })),
        recommendation: `แนะนำ ${sortedCandidates[0]?.name} เนื่องจากมี AI Fit Score สูงสุด`,
        summary: "การจัดอันดับอิงจาก AI Fit Score",
        detailedAnalysis: "กรุณาพิจารณาข้อมูลเพิ่มเติมในการตัดสินใจ",
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in compare-candidates:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
