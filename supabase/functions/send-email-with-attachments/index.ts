import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MICROSOFT_CLIENT_ID = Deno.env.get('MICROSOFT_CLIENT_ID');
const MICROSOFT_CLIENT_SECRET = Deno.env.get('MICROSOFT_CLIENT_SECRET');
const MICROSOFT_TENANT_ID = Deno.env.get('MICROSOFT_TENANT_ID');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Candidate {
  id: string;
  name: string;
  position: string;
  resume_url?: string;
  ai_score?: number;
  pre_screen_comment?: string;
}

interface EmailRequest {
  to: string;
  toName: string;
  department: string;
  senderRole?: string;
  candidates: Candidate[];
  positions: string;
  portalUrl?: string;
  isFinalInterview?: boolean;
}

async function getAccessToken(): Promise<string> {
  const tokenUrl = `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID!,
    client_secret: MICROSOFT_CLIENT_SECRET!,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get access token:', error);
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function sendEmail(accessToken: string, emailData: EmailRequest, senderEmail: string) {
  const senderRole = emailData.senderRole || 'HR';
  const portalUrl = emailData.portalUrl || '#';
  const isFinalInterview = emailData.isFinalInterview || false;

  // Count candidates with resume files
  const candidatesWithResume = emailData.candidates.filter(c => c.resume_url).length;
  const candidateCount = emailData.candidates.length;

  // Generate candidate cards HTML
  const candidateCards = emailData.candidates
    .map((c, index) => {
      const scorePercentage = c.ai_score || 0;
      const scoreColor = scorePercentage >= 80 ? '#10b981' : scorePercentage >= 60 ? '#f59e0b' : '#ef4444';
      return `
        <tr>
          <td style="padding: 8px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
              <tr>
                <td style="padding: 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50" valign="top">
                        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: 18px; text-align: center; line-height: 44px;">
                          ${c.name.charAt(0).toUpperCase()}
                        </div>
                      </td>
                      <td style="padding-left: 16px;" valign="top">
                        <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${c.name}</p>
                        <p style="margin: 0; font-size: 13px; color: #6b7280;">${c.position}</p>
                      </td>
                      <td width="80" align="right" valign="top">
                        <div style="display: inline-block; padding: 8px 16px; background: ${scoreColor}15; border-radius: 20px;">
                          <span style="font-size: 18px; font-weight: 700; color: ${scoreColor};">${scorePercentage}%</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                  ${c.pre_screen_comment ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                      <tr>
                        <td style="padding: 12px 16px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #6366f1;">
                          <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px;">Pre-Screen Comment</p>
                          <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.5;">${c.pre_screen_comment}</p>
                        </td>
                      </tr>
                    </table>
                  ` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join('');

  // Different styling for Final Interview
  const headerGradient = isFinalInterview
    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)';
  const primaryColor = isFinalInterview ? '#d97706' : '#6366f1';
  const headerTitle = isFinalInterview ? 'Final Interview' : 'ผู้สมัครรอพิจารณา';
  const headerSubtitle = isFinalInterview
    ? `ผู้สมัครผ่าน First Interview | ตำแหน่ง ${emailData.positions}`
    : `${candidateCount} คน | ตำแหน่ง ${emailData.positions}`;
  const greetingMessage = isFinalInterview
    ? `ฝ่าย <strong style="color: ${primaryColor};">${senderRole}</strong> ขอส่งรายชื่อผู้สมัครที่ผ่านการสัมภาษณ์ First Interview แล้ว
       เพื่อให้ท่านพิจารณานัดสัมภาษณ์รอบสุดท้าย (Final Interview)`
    : `ฝ่าย <strong style="color: ${primaryColor};">${senderRole}</strong> ขอส่งรายชื่อผู้สมัครที่ผ่านการ Pre-Screen เบื้องต้น
       เพื่อให้ท่านพิจารณาคัดเลือกผู้ที่สนใจนัดสัมภาษณ์`;
  const ctaButtonText = isFinalInterview
    ? 'นัดสัมภาษณ์ Final Interview'
    : 'ดูรายละเอียดและนัดสัมภาษณ์';

  const emailBody = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isFinalInterview ? 'Final Interview' : 'Resume ผู้สมัครงาน'}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">

              <!-- Header with Gradient -->
              <tr>
                <td style="background: ${headerGradient}; padding: 40px 30px; text-align: center;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                          <img src="${isFinalInterview ? 'https://img.icons8.com/fluency/48/000000/prize.png' : 'https://img.icons8.com/fluency/48/000000/resume.png'}" alt="${isFinalInterview ? 'Final Interview' : 'Resume'}" style="width: 40px; height: 40px;" />
                        </div>
                        <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                          ${headerTitle}
                        </h1>
                        <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">
                          ${headerSubtitle}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Greeting Section -->
              <tr>
                <td style="padding: 32px 30px 24px;">
                  <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                    สวัสดีค่ะ <strong style="color: ${primaryColor};">${emailData.toName}</strong>
                  </p>
                  <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.7;">
                    ${greetingMessage}
                  </p>
                </td>
              </tr>

              <!-- Stats Bar -->
              <tr>
                <td style="padding: 0 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td width="50%" style="padding: 20px; text-align: center; border-right: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 4px 0; font-size: 28px; font-weight: 700; color: ${primaryColor};">${candidateCount}</p>
                        <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">${isFinalInterview ? 'ผู้สมัคร' : 'ผู้สมัครทั้งหมด'}</p>
                      </td>
                      <td width="50%" style="padding: 20px; text-align: center;">
                        <p style="margin: 0 0 4px 0; font-size: 28px; font-weight: 700; color: #10b981;">${isFinalInterview ? emailData.candidates[0]?.ai_score || 0 : candidatesWithResume}</p>
                        <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">${isFinalInterview ? 'คะแนน First Interview' : 'Resume แนบ'}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Candidates Section -->
              <tr>
                <td style="padding: 24px 22px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 16px;">
                        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: 1px;">
                          รายชื่อผู้สมัคร
                        </p>
                      </td>
                    </tr>
                    ${candidateCards}
                  </table>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td style="padding: 16px 30px 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${portalUrl}"
                           style="display: inline-block; padding: 16px 48px; background: ${headerGradient}; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px ${isFinalInterview ? 'rgba(217, 119, 6, 0.4)' : 'rgba(99, 102, 241, 0.4)'}; letter-spacing: 0.3px;">
                          ${ctaButtonText}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top: 16px;">
                        <p style="margin: 0; font-size: 13px; color: #9ca3af;">
                          ลิงก์นี้จะหมดอายุใน 7 วัน
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding: 0 30px;">
                  <div style="height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent);"></div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 30px; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;">
                    ส่งจากระบบ <strong style="color: #6366f1;">Core-Fit</strong> HR Recruitment
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #d1d5db;">
                    หากมีข้อสงสัย กรุณาติดต่อฝ่าย HR
                  </p>
                </td>
              </tr>

            </table>

            <!-- Bottom Spacing -->
            <table width="600" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 24px; text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                    © 2024 Core-Fit. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const emailSubject = isFinalInterview
    ? `Final Interview - ผู้สมัครตำแหน่ง ${emailData.positions} ผ่าน First Interview`
    : `Resume ผู้สมัครตำแหน่ง ${emailData.positions} - รอพิจารณา`;

  const message: any = {
    message: {
      subject: emailSubject,
      body: {
        contentType: 'HTML',
        content: emailBody,
      },
      toRecipients: [
        {
          emailAddress: {
            address: emailData.to,
          },
        },
      ],
      attachments: [],
    },
    saveToSentItems: true,
  };

  // Add resume attachments if available
  for (const candidate of emailData.candidates) {
    if (candidate.resume_url) {
      try {
        console.log(`Fetching resume for ${candidate.name} from:`, candidate.resume_url);
        
        // Fetch resume file with proper headers
        const fileResponse = await fetch(candidate.resume_url, {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          },
        });
        
        if (fileResponse.ok) {
          const fileBuffer = await fileResponse.arrayBuffer();
          const base64Content = btoa(
            String.fromCharCode(...new Uint8Array(fileBuffer))
          );
          
          // Extract filename from URL or use default
          let filename = candidate.resume_url.split('/').pop() || `Resume_${candidate.name}.pdf`;
          // Decode URL-encoded filename
          filename = decodeURIComponent(filename);
          
          console.log(`Successfully attached resume: ${filename} (${fileBuffer.byteLength} bytes)`);

          message.message.attachments.push({
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: filename,
            contentType: 'application/pdf',
            contentBytes: base64Content,
          });
        } else {
          console.error(`Failed to fetch resume for ${candidate.name}: ${fileResponse.status} ${fileResponse.statusText}`);
        }
      } catch (error) {
        console.error(`Failed to fetch resume for ${candidate.name}:`, error);
      }
    } else {
      console.log(`No resume URL for ${candidate.name}`);
    }
  }
  
  console.log(`Total attachments: ${message.message.attachments.length}`);

  const sendMailUrl = `https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`;
  
  const response = await fetch(sendMailUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to send email:', error);
    throw new Error(`Failed to send email: ${error}`);
  }

  return { success: true };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EmailRequest = await req.json();

    console.log('Sending email to:', emailData.to);
    console.log('Number of candidates:', emailData.candidates.length);
    console.log('Candidates data:', JSON.stringify(emailData.candidates.map(c => ({
      name: c.name,
      has_resume: !!c.resume_url,
      resume_url: c.resume_url
    })), null, 2));

    // Get authenticated user's email from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's profile to find their email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Could not find user profile');
    }

    const senderEmail = profile.email;
    console.log('Sender email:', senderEmail);

    // Get access token
    const accessToken = await getAccessToken();

    // Send email with attachments
    const result = await sendEmail(accessToken, emailData, senderEmail);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in send-email-with-attachments function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
