import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { documentText, documentType } = await req.json();

    if (!documentText) {
      throw new Error('Document text is required');
    }

    if (!documentType || !['jd', 'requisition_form'].includes(documentType)) {
      throw new Error('Document type must be either "jd" or "requisition_form"');
    }

    console.log(`Parsing ${documentType} document with AI...`);

    const systemPrompt = documentType === 'jd' 
      ? 'You are a Job Description parser. Analyze the provided JD document and extract structured job information for a job requisition form.'
      : 'You are a Job Requisition Form parser. Analyze the provided requisition form and extract structured information for processing.';

    const userPrompt = documentType === 'jd'
      ? `Parse this Job Description (JD) document and extract relevant information for the job requisition form. Focus on extracting:\n- Position title and department\n- Job duties and responsibilities\n- Required qualifications (education, experience, skills)\n- Work location and reporting structure\n\nJD Document:\n\n${documentText}`
      : `Parse this Job Requisition Form (ใบขออัตรา) and extract relevant information. Focus on extracting:\n- Position details and quantity requested\n- Justification for hiring\n- Department and work location\n- Any qualifications mentioned\n\nRequisition Form:\n\n${documentText}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.3,
        tools: [
          {
            type: 'function',
            function: {
              name: 'parse_jd_document',
              description: 'Extract structured information from a Job Description or Requisition Form document.',
              parameters: {
                type: 'object',
                properties: {
                  position: { type: 'string', description: 'Job position title (Thai or English)' },
                  department: { type: 'string', description: 'Department name' },
                  job_grade: { type: 'string', description: 'Job Grade level if mentioned' },
                  work_location: { type: 'string', description: 'Work location (สำนักงานใหญ่ สุรวงศ์ or โรงงานนครปฐม)' },
                  reports_to: { type: 'string', description: 'Position reports to (supervisor/manager name)' },
                  job_duties: { type: 'string', description: 'Summary of job duties and responsibilities' },
                  gender: { type: 'string', description: 'Gender requirement: ชาย, หญิง, or ไม่ระบุ' },
                  max_age: { type: 'string', description: 'Maximum age requirement (number only)' },
                  min_education: { type: 'string', description: 'Minimum education level: มัธยมศึกษา, ปวช., ปวส., ปริญญาตรี, ปริญญาโท, ปริญญาเอก' },
                  field_of_study: { type: 'string', description: 'Field of study or major' },
                  min_experience: { type: 'string', description: 'Minimum years of experience required' },
                  experience_in: { type: 'string', description: 'Type of experience required' },
                  other_skills: { type: 'string', description: 'Other skills, languages, computer skills, driving license, etc.' },
                  marital_status: { type: 'string', description: 'Marital status requirement: โสด, สมรส, หย่า, or ไม่ระบุ' },
                  quantity: { type: 'number', description: 'Number of positions to hire' },
                  justification: { type: 'string', description: 'Justification or reason for hiring' },
                  hiring_type: { type: 'string', description: 'Type of hiring: permanent, temporary, or replacement' },
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