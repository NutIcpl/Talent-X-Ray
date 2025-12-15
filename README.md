# Talent X-Ray

ระบบบริหารจัดการการสรรหาบุคลากรอัจฉริยะ (AI-Powered Recruitment Management System)

![Talent X-Ray](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6.svg)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ภาพรวม

Talent X-Ray เป็นระบบบริหารจัดการการสรรหาบุคลากรแบบครบวงจร ตั้งแต่การสร้างตำแหน่งงาน การรับสมัคร การคัดกรองผู้สมัคร การสัมภาษณ์ จนถึงการจ้างงาน พร้อมด้วยเทคโนโลยี AI ที่ช่วยวิเคราะห์และจับคู่ผู้สมัครกับตำแหน่งงานได้อย่างแม่นยำ

### Demo

**Live Demo:** [https://talent-x-ray.vercel.app](https://talent-x-ray.vercel.app)

## คุณสมบัติหลัก

### 1. Dashboard
- ภาพรวมกระบวนการสรรหาแบบ Real-time
- Widget แสดงผู้สมัครล่าสุด
- สรุปตำแหน่งงานที่เปิดรับ
- แผนที่แสดงที่ตั้งบริษัท

### 2. การจัดการผู้สมัคร (Candidates)
- ค้นหาและกรองผู้สมัครขั้นสูง
- ติดตามสถานะผู้สมัคร (รอพิจารณา → สนใจ → สัมภาษณ์ → จ้างงาน)
- **AI Candidate Comparison** - เปรียบเทียบผู้สมัครด้วย AI
- **AI Fit Score** - คำนวณคะแนนความเหมาะสมอัตโนมัติ
- ดูประวัติการศึกษา ประสบการณ์ และทักษะ
- จัดการประวัติการจ้างงาน

### 3. การจัดการตำแหน่งงาน (Jobs)
- สร้างและจัดการประกาศรับสมัครงาน
- กรองตามแผนก สถานที่ และสถานะ
- เปิด/ปิดตำแหน่งงาน
- ดูผู้สมัครตามตำแหน่ง

### 4. Job Requisitions
- อัพโหลดไฟล์ JD (Job Description)
- **AI-Powered JD Parsing** - วิเคราะห์ JD อัตโนมัติด้วย Gemini 2.0
- ระบบอนุมัติตำแหน่งงาน (Pending → Approved → Approved HR)
- Export เป็น PDF

### 5. ใบสมัครงาน (Job Application)
- ฟอร์มสมัครงานครบถ้วน
- อัพโหลด Resume พร้อม **AI Resume Parsing**
- กรอกข้อมูลอัตโนมัติจาก Resume
- สร้าง PDF ใบสมัครงาน (รองรับภาษาไทย)

### 6. การจัดการสัมภาษณ์ (Interviews)
- นัดหมายสัมภาษณ์หลายรอบ
  - Pre-Screen Interview
  - First Interview
  - Final Interview
- ระบบให้คะแนนการสัมภาษณ์
- บันทึก Feedback และข้อเสนอแนะ
- ติดตามสถานะ Offer/Not Offer

### 7. Manager Portal
- เข้าถึงด้วย Token (ไม่ต้อง Login)
- ผู้จัดการประเมินผู้สมัครได้
- เสนอช่วงเวลาสัมภาษณ์
- ให้คะแนนและ Feedback

### 8. รายงานและวิเคราะห์ (Reports)
- **Recruitment Funnel** - แสดงการเปลี่ยนแปลงในแต่ละขั้นตอน
- **Trend Chart** - แนวโน้มการจ้างงาน
- **Department Analysis** - วิเคราะห์ตามแผนก
- **Source Tracking** - ติดตามแหล่งที่มาผู้สมัคร
- Export CSV และ Chart PNG

### 9. การจัดการผู้ใช้และสิทธิ์ (Admin)
- จัดการผู้ใช้งานระบบ
- 8 ระดับสิทธิ์: Admin, HR Manager, Recruiter, Interviewer, Viewer, Manager, CEO, Candidate
- Role-Based Access Control (RBAC)

## เทคโนโลยีที่ใช้

### Frontend
| Technology | Version | Description |
|------------|---------|-------------|
| React | 18.3.1 | JavaScript Library สำหรับ UI |
| TypeScript | 5.6.2 | Type-safe JavaScript |
| Vite | 5.4.19 | Build Tool และ Dev Server |
| Tailwind CSS | 3.4.17 | Utility-first CSS Framework |
| shadcn/ui | - | Component Library |
| React Router | 6.30.1 | Client-side Routing |
| TanStack Query | 5.83.0 | Data Fetching & Caching |
| React Hook Form | 7.61.1 | Form Management |
| Zod | 3.25.76 | Schema Validation |
| Recharts | 2.15.4 | Data Visualization |
| Lucide React | 0.462.0 | Icon Library |

### Backend
| Technology | Description |
|------------|-------------|
| Supabase | Backend-as-a-Service (PostgreSQL) |
| Supabase Auth | Authentication & Authorization |
| Supabase Edge Functions | Serverless Functions (Deno) |
| Row Level Security | Database Security |

### AI Integration
| Model | Usage |
|-------|-------|
| Google Gemini 2.0 Flash | Resume Parsing, JD Parsing |
| Claude Sonnet 4 (via OpenRouter) | Candidate Comparison |

### PDF Generation
| Library | Usage |
|---------|-------|
| jsPDF | PDF Generation |
| jsPDF AutoTable | Table Generation |
| Sarabun Font | Thai Language Support |

## โครงสร้างโปรเจค

```
talent-x-ray/
├── src/
│   ├── pages/                    # หน้าหลักของแอพ
│   │   ├── Dashboard.tsx         # หน้า Dashboard
│   │   ├── Candidates.tsx        # จัดการผู้สมัคร
│   │   ├── Jobs.tsx              # จัดการตำแหน่งงาน
│   │   ├── JobApplication.tsx    # ฟอร์มสมัครงาน
│   │   ├── JobRequisitions.tsx   # Job Requisitions
│   │   ├── Interviews.tsx        # จัดการสัมภาษณ์
│   │   ├── ManagerPortal.tsx     # Portal สำหรับผู้จัดการ
│   │   ├── Reports.tsx           # รายงานและวิเคราะห์
│   │   ├── Settings.tsx          # ตั้งค่าระบบ
│   │   └── Auth.tsx              # หน้า Login
│   │
│   ├── components/               # React Components
│   │   ├── candidates/           # Components ผู้สมัคร (18 files)
│   │   ├── interviews/           # Components สัมภาษณ์ (9 files)
│   │   ├── jobs/                 # Components ตำแหน่งงาน
│   │   ├── requisitions/         # Components Job Requisition
│   │   ├── dashboard/            # Components Dashboard
│   │   ├── reports/              # Components รายงาน (15 files)
│   │   ├── settings/             # Components ตั้งค่า
│   │   ├── layout/               # Layout Components
│   │   └── ui/                   # shadcn/ui Components
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useCandidatesData.ts
│   │   ├── useCandidateDetails.ts
│   │   ├── useCalculateFitScore.ts
│   │   ├── useInterviews.ts
│   │   ├── useJobRequisitions.ts
│   │   └── ...
│   │
│   ├── contexts/                 # React Context
│   │   ├── AuthContext.tsx
│   │   ├── CandidatesContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts         # Supabase Client
│   │       └── types/            # Auto-generated Types
│   │
│   ├── lib/                      # Utility Functions
│   │   ├── calculateJobFitScore.ts
│   │   ├── generateApplicationFormPDF.ts
│   │   └── exportUtils.ts
│   │
│   └── types/                    # TypeScript Types
│
├── supabase/
│   ├── functions/                # Edge Functions
│   │   ├── parse-resume/         # AI Resume Parser
│   │   ├── parse-jd-document/    # AI JD Parser
│   │   ├── calculate-fit-score/  # AI Fit Score
│   │   ├── compare-candidates/   # AI Candidate Comparison
│   │   └── send-email-with-attachments/
│   │
│   ├── migrations/               # Database Migrations
│   └── config.toml               # Supabase Config
│
├── public/                       # Static Assets
├── vercel.json                   # Vercel Config
├── vite.config.ts                # Vite Config
├── tailwind.config.js            # Tailwind Config
└── package.json
```

## การติดตั้ง

### ความต้องการเบื้องต้น

- Node.js 18+
- npm หรือ yarn
- Supabase Account

### ขั้นตอนการติดตั้ง

1. **Clone Repository**
```bash
git clone https://github.com/NutIcpl/Talent-X-Ray.git
cd Talent-X-Ray
```

2. **ติดตั้ง Dependencies**
```bash
npm install
```

3. **ตั้งค่า Environment Variables**

สร้างไฟล์ `.env` ที่ root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
OPENAI_API_KEY=your_openrouter_api_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **รัน Development Server**
```bash
npm run dev
```

แอพจะรันที่ `http://localhost:8080`

## การ Deploy

### Deploy ไปยัง Vercel

1. **Login Vercel**
```bash
npx vercel login
```

2. **Deploy**
```bash
npx vercel --prod
```

### ตั้งค่า Environment Variables บน Vercel

```bash
npx vercel env add VITE_SUPABASE_URL production
npx vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
npx vercel env add VITE_SUPABASE_PROJECT_ID production
npx vercel env add OPENAI_API_KEY production
```

### Deploy Supabase Edge Functions

```bash
npx supabase login
npx supabase functions deploy parse-resume --project-ref your_project_id
npx supabase functions deploy parse-jd-document --project-ref your_project_id
npx supabase functions deploy calculate-fit-score --project-ref your_project_id
npx supabase functions deploy compare-candidates --project-ref your_project_id
```

### ตั้งค่า Secrets สำหรับ Edge Functions

```bash
npx supabase secrets set OPENAI_API_KEY=your_openrouter_api_key --project-ref your_project_id
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | รัน Development Server |
| `npm run build` | Build สำหรับ Production |
| `npm run preview` | Preview Production Build |
| `npm run lint` | ตรวจสอบ Code ด้วย ESLint |

## Database Schema

### ตารางหลัก

| Table | Description |
|-------|-------------|
| `profiles` | ข้อมูลผู้ใช้งาน |
| `user_roles` | สิทธิ์ผู้ใช้งาน |
| `candidates` | ข้อมูลผู้สมัคร |
| `applications` | ใบสมัครงาน |
| `job_positions` | ตำแหน่งงาน |
| `job_requisitions` | คำขอเปิดตำแหน่งงาน |
| `interviews` | ข้อมูลการสัมภาษณ์ |
| `employment_records` | ประวัติการจ้างงาน |
| `manager_invitations` | Token สำหรับ Manager Portal |

## การใช้งาน AI Features

### 1. Resume Parsing
- อัพโหลด Resume (PDF) ในหน้า Job Application
- กดปุ่ม "AI อ่าน Resume"
- ระบบจะดึงข้อมูลและกรอกฟอร์มอัตโนมัติ

### 2. JD Parsing
- ไปหน้า Job Requisitions
- อัพโหลดไฟล์ JD
- กดปุ่ม "AI ช่วยอ่าน JD"
- ระบบจะวิเคราะห์และกรอกข้อมูลให้

### 3. AI Fit Score
- เปิดรายละเอียดผู้สมัคร
- กดปุ่ม "Generate AI Score"
- ดูคะแนนความเหมาะสมและเหตุผล

### 4. Candidate Comparison
- ไปแท็บ "Offer" ในหน้า Candidates
- กดปุ่ม "เปรียบเทียบด้วย AI"
- เลือกผู้สมัครที่ต้องการเปรียบเทียบ
- ดูผลการจัดอันดับและคำแนะนำจาก AI

## การสนับสนุนภาษาไทย

- UI รองรับภาษาไทยเต็มรูปแบบ
- PDF Generation ใช้ฟอนต์ Sarabun
- AI Models รองรับการวิเคราะห์เอกสารภาษาไทย

## License

MIT License - ดูไฟล์ [LICENSE](LICENSE) สำหรับรายละเอียด

## ผู้พัฒนา

- **NutIcpl** - [GitHub](https://github.com/NutIcpl)

## การสนับสนุน

หากพบปัญหาหรือต้องการเสนอแนะ กรุณาสร้าง [Issue](https://github.com/NutIcpl/Talent-X-Ray/issues) ใหม่

---

**Talent X-Ray** - Powering Smart Recruitment with AI
