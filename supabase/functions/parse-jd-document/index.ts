import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fix Thai sara am (ำ) encoding issues
function fixThaiText(text: string | undefined | null): string {
  if (!text) return '';
  
  // Common Thai words that get corrupted with sara am
  const corrections: Record<string, string> = {
    'งำน': 'งาน',
    'ขำย': 'ขาย',
    'วำงแผน': 'วางแผน',
    'ติดตำม': 'ติดตาม',
    'บริหำร': 'บริหาร',
    'ทำงำน': 'ทำงาน',
    'กำร': 'การ',
    'ช่องทำง': 'ช่องทาง',
    'จัดจำหน่ำย': 'จัดจำหน่าย',
    'ประสิทธิภำพ': 'ประสิทธิภาพ',
    'มูลค่ำ': 'มูลค่า',
    'กระบวนกำร': 'กระบวนการ',
    'เป้ำหมำย': 'เป้าหมาย',
    'องค์กร': 'องค์กร',
    'ตำแหน่ง': 'ตำแหน่ง',
    'สำนักงำน': 'สำนักงาน',
    'คุณสมบัติ': 'คุณสมบัติ',
    'ควำมสำมำรถ': 'ความสามารถ',
    'ประสบกำรณ์': 'ประสบการณ์',
    'กำรศึกษำ': 'การศึกษา',
    'ทักษะ': 'ทักษะ',
    'เงินเดือน': 'เงินเดือน',
    'สถำนที่': 'สถานที่',
    'ปฏิบัติงำน': 'ปฏิบัติงาน',
    'รับผิดชอบ': 'รับผิดชอบ',
    'พัฒนำ': 'พัฒนา',
    'วิเครำะห์': 'วิเคราะห์',
    'จำนวน': 'จำนวน',
    'อำยุ': 'อายุ',
    'ไม่เกิน': 'ไม่เกิน',
    'อย่ำงน้อย': 'อย่างน้อย',
  };
  
  let fixed = text;
  
  // Apply corrections
  for (const [wrong, correct] of Object.entries(corrections)) {
    fixed = fixed.replace(new RegExp(wrong, 'g'), correct);
  }
  
  // Fix common pattern: consonant + ำ + vowel should be consonant + า + consonant
  // This is a more general fix for sara am issues
  fixed = fixed.replace(/([ก-ฮ])ำ([ก-ฮ])/g, '$1า$2');
  
  return fixed;
}

interface ParsedJDDocument {
  position?: string;
  department?: string;
  job_grade?: string;
  work_location?: string;
  reports_to?: string;
  job_duties?: string;
  gender?: string;
  max_age?: string;
  min_education?: string;
  field_of_study?: string;
  min_experience?: string;
  experience_in?: string;
  other_skills?: string;
  marital_status?: string;
  quantity?: number;
  justification?: string;
  hiring_type?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, documentType, fileBase64 } = await req.json();

    if (!documentText && !fileBase64) {
      throw new Error('Document text or file base64 is required');
    }

    if (!documentType || !['jd', 'requisition_form'].includes(documentType)) {
      throw new Error('Document type must be either "jd" or "requisition_form"');
    }

    console.log(`Parsing ${documentType} document with AI...`);

    const systemPrompt = documentType === 'jd' 
      ? `You are an expert Job Description parser specializing in Thai and English documents. You must extract EXACT information from the document without making assumptions. If information is not explicitly stated, leave the field empty. 

CRITICAL THAI LANGUAGE RULES:
- Preserve EXACT Thai spelling and characters as written in the document
- DO NOT separate Thai vowels from consonants (e.g., keep "งาน" not "งำน", "ขาย" not "ขำย")
- Maintain proper Thai orthography and sara am (ำ) placement
- Copy Thai text character-by-character exactly as it appears
- Do not transliterate or modify Thai characters in any way`
      : `You are an expert Job Requisition Form parser specializing in Thai corporate documents (ใบขออัตรา). You must extract EXACT information from the document without making assumptions. Focus on precise data extraction from Thai government and corporate forms.

CRITICAL THAI LANGUAGE RULES:
- Preserve EXACT Thai spelling and characters as written in the document
- DO NOT separate Thai vowels from consonants (e.g., keep "งาน" not "งำน", "ขาย" not "ขำย")
- Maintain proper Thai orthography and sara am (ำ) placement
- Copy Thai text character-by-character exactly as it appears
- Do not transliterate or modify Thai characters in any way`;

    // Prepare messages for Gemini Vision API
    const messages = [];
    
    if (fileBase64) {
      // Use OCR with image/PDF input
      const userPrompt = documentType === 'jd'
        ? `Analyze this Job Description (JD) document image/PDF with MAXIMUM ACCURACY using OCR. Extract ONLY the information that is explicitly visible in the document.

CRITICAL INSTRUCTIONS:
- Use OCR to read all text from the document image
- Extract EXACT text as written in the document
- For Thai text, preserve original Thai characters and formatting
- For numbers, extract exact values (e.g., "3 ปี" for experience, "35" for max age)
- For education levels, use exact Thai terms: มัธยมศึกษา, ปวช., ปวส., ปริญญาตรี, ปริญญาโท, ปริญญาเอก
- For gender, use exact Thai terms: ชาย, หญิง, ไม่ระบุ
- For marital status, use: โสด, สมรส, หย่า, ไม่ระบุ
- For work location, look for specific mentions like "สำนักงานใหญ่ สุรวงศ์", "โรงงานนครปฐม", etc.
- If information is not clearly visible, leave field empty

Extract information for these specific fields with maximum precision:`
        : `Analyze this Job Requisition Form (ใบขออัตรา) document image/PDF with MAXIMUM ACCURACY using OCR. This is a Thai corporate/government form requesting new employee positions.

CRITICAL INSTRUCTIONS:
- Use OCR to read all text from the document image
- Extract EXACT text as written in the Thai document
- Look for specific Thai form fields and sections
- For quantities, extract exact numbers requested
- For justification, extract the complete reasoning provided
- For positions, extract exact job titles in Thai
- Pay attention to form structure and official terminology
- If information is not clearly visible, leave field empty

Extract information for these specific fields with maximum precision:`;

      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: userPrompt
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:application/pdf;base64,${fileBase64}`
            }
          }
        ]
      });
    } else {
      // Use text input (fallback)
      const userPrompt = documentType === 'jd'
        ? `Parse this Job Description (JD) document with MAXIMUM ACCURACY. Extract ONLY the information that is explicitly stated in the document.

DOCUMENT TO PARSE:
${documentText}

Extract information for these specific fields with maximum precision:`
        : `Parse this Job Requisition Form (ใบขออัตรา) with MAXIMUM ACCURACY.

THAI DOCUMENT TO PARSE:
${documentText}

Extract information for these specific fields with maximum precision:`;

      messages.push({
        role: 'user',
        content: userPrompt
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app.com',
        'X-Title': 'Job Requisition Parser',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messages,
        ],
        temperature: 0.1,
        tools: [
          {
            type: 'function',
            function: {
              name: 'parse_jd_document',
              description: 'Extract structured information from a Job Description or Requisition Form document.',
              parameters: {
                type: 'object',
                properties: {
                  position: { 
                    type: 'string', 
                    description: 'EXACT job position title as written in document (Thai or English). Examples: "นักวิเคราะห์ระบบ", "Software Developer", "เจ้าหน้าที่บัญชี"' 
                  },
                  department: { 
                    type: 'string', 
                    description: 'EXACT department name as written. Examples: "แผนกเทคโนโลยีสารสนเทศ", "ฝ่ายบัญชี", "IT Department"' 
                  },
                  job_grade: { 
                    type: 'string', 
                    description: 'EXACT job grade/level if mentioned. Examples: "Grade 5", "ระดับ 3", "Senior Level"' 
                  },
                  salary: { 
                    type: 'string', 
                    description: 'EXACT salary information as written. Examples: "25,000-30,000 บาท", "ตามตกลง", "Starting 35K", "Negotiable"' 
                  },
                  work_location: { 
                    type: 'string', 
                    description: 'EXACT work location as written. Examples: "สำนักงานใหญ่ สุรวงศ์", "โรงงานนครปฐม", "Bangkok Office", "Remote Work"' 
                  },
                  reports_to: { 
                    type: 'string', 
                    description: 'EXACT supervisor/manager title or name as written. Examples: "ผู้จัดการฝ่าย IT", "IT Manager", "หัวหน้าแผนก"' 
                  },
                  job_duties: { 
                    type: 'string', 
                    description: 'COMPLETE job duties and responsibilities as written in document. Include all bullet points and details exactly as stated.' 
                  },
                  gender: { 
                    type: 'string', 
                    description: 'EXACT gender requirement in Thai: "ชาย", "หญิง", or "ไม่ระบุ". Only use these exact terms.' 
                  },
                  max_age: { 
                    type: 'string', 
                    description: 'EXACT maximum age as written. Examples: "35", "40 ปี", "ไม่เกิน 30 ปี". Extract number and any Thai text exactly.' 
                  },
                  min_education: { 
                    type: 'string', 
                    description: 'EXACT education level in Thai: "มัธยมศึกษา", "ปวช.", "ปวส.", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก". Use exact Thai terms only.' 
                  },
                  field_of_study: { 
                    type: 'string', 
                    description: 'EXACT field of study/major as written. Examples: "วิทยาการคอมพิวเตอร์", "บัญชี", "Computer Science", "Engineering"' 
                  },
                  min_experience: { 
                    type: 'string', 
                    description: 'EXACT experience requirement as written. Examples: "3 ปี", "5 years", "อย่างน้อย 2 ปี", "ไม่น้อยกว่า 1 ปี"' 
                  },
                  experience_in: { 
                    type: 'string', 
                    description: 'EXACT type of experience required as written. Examples: "ด้านการพัฒนาระบบ", "Software Development", "การบัญชี"' 
                  },
                  other_skills: { 
                    type: 'string', 
                    description: 'COMPLETE list of other skills, languages, computer skills, driving license, etc. as written in document. Include all details exactly.' 
                  },
                  marital_status: { 
                    type: 'string', 
                    description: 'EXACT marital status requirement in Thai: "โสด", "สมรส", "หย่า", or "ไม่ระบุ". Only use these exact terms.' 
                  },
                  quantity: { 
                    type: 'number', 
                    description: 'EXACT number of positions to hire as stated in document. Extract only the numeric value.' 
                  },
                  justification: { 
                    type: 'string', 
                    description: 'COMPLETE justification or reason for hiring as written in document. Include all reasoning and details exactly as stated.' 
                  },
                  hiring_type: { 
                    type: 'string', 
                    description: 'EXACT type of hiring as written: "ถาวร", "ชั่วคราว", "แทนที่", "permanent", "temporary", "replacement"' 
                  },
                },
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'parse_jd_document' } },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();

    let parsedData: ParsedJDDocument = {};

    try {
      const choice = data.choices?.[0];
      const toolCall = choice?.message?.tool_calls?.[0];

      if (toolCall?.function?.arguments) {
        const args = JSON.parse(toolCall.function.arguments);
        parsedData = args;
        console.log('Parsed via tool_call:', parsedData);
      } else {
        // Fallback: try to parse JSON from content
        const content = choice?.message?.content ?? '';
        console.log('AI response (fallback path):', content);

        const cleanedContent = content
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/[\u0000-\u0019]+/g, ' ')
          .trim();

        parsedData = JSON.parse(cleanedContent);
      }
      
      // Fix Thai text encoding issues
      parsedData = {
        position: fixThaiText(parsedData.position),
        department: fixThaiText(parsedData.department),
        job_grade: fixThaiText(parsedData.job_grade),
        salary: fixThaiText(parsedData.salary),
        work_location: fixThaiText(parsedData.work_location),
        reports_to: fixThaiText(parsedData.reports_to),
        job_duties: fixThaiText(parsedData.job_duties),
        gender: fixThaiText(parsedData.gender),
        max_age: fixThaiText(parsedData.max_age),
        min_education: fixThaiText(parsedData.min_education),
        field_of_study: fixThaiText(parsedData.field_of_study),
        min_experience: fixThaiText(parsedData.min_experience),
        experience_in: fixThaiText(parsedData.experience_in),
        other_skills: fixThaiText(parsedData.other_skills),
        marital_status: fixThaiText(parsedData.marital_status),
        quantity: parsedData.quantity,
        justification: fixThaiText(parsedData.justification),
        hiring_type: fixThaiText(parsedData.hiring_type),
      };
      
      console.log('Fixed Thai text:', parsedData);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: parsedData,
        documentType 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in parse-jd-document function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});