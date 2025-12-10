import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { candidateData, jobData } = await req.json();

    const prompt = `คุณเป็นผู้เชี่ยวชาญด้านการจับคู่ผู้สมัครงานกับตำแหน่งงาน กรุณาวิเคราะห์และให้คะแนนความเหมาะสม (0-100) ระหว่างผู้สมัครและตำแหน่งงาน

เกณฑ์การให้คะแนน:
1. ประสบการณ์ทำงานที่ตรงกับตำแหน่งงาน (65%)
   - ตำแหน่งงานตรงกัน (30%)
   - จำนวนปีประสบการณ์ (35%)
2. คุณสมบัติ (10%)
   - คุณภาพของ Resume และ Portfolio
3. วุฒิการศึกษา (10%)
   - ระดับการศึกษาตรงตามที่กำหนด
4. ทักษะและความสามารถอื่น ๆ (15%)
   - ทักษะที่ตรงกับความต้องการ

ข้อมูลตำแหน่งงาน:
- ตำแหน่ง: ${jobData.title}
- แผนก: ${jobData.department}
- คุณสมบัติ: ${jobData.requirements || 'ไม่ระบุ'}
- หน้าที่: ${jobData.responsibilities || 'ไม่ระบุ'}

ข้อมูลผู้สมัคร:
- ชื่อ: ${candidateData.name}
- การศึกษา: ${candidateData.education || 'ไม่ระบุ'}
- ประสบการณ์: ${candidateData.experience_years || 0} ปี
- ทักษะ: ${candidateData.skills?.join(', ') || 'ไม่ระบุ'}

กรุณาตอบเป็น JSON format:
{
  "score": <คะแนน 0-100>,
  "reasoning": "<เหตุผลสั้นๆ ภาษาไทย>",
  "breakdown": {
    "experience": <คะแนนประสบการณ์ 0-65>,
    "qualifications": <คะแนนคุณสมบัติ 0-10>,
    "education": <คะแนนการศึกษา 0-10>,
    "skills": <คะแนนทักษะ 0-15>
  }
}`;


    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app.com',
        'X-Title': 'AI Fit Score Calculator',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-preview',
        messages: [
          { role: 'system', content: 'You are an expert HR analyst.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
