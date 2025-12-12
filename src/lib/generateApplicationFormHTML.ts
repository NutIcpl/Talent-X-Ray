// Function to generate HTML application form from form data

interface Education {
  level: string;
  institution: string;
  major: string;
  gpa: string;
  yearGraduated: string;
}

interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  salary: string;
  responsibilities: string;
  reason: string;
}

interface FamilyMember {
  name: string;
  relationship: string;
  age: string;
  occupation: string;
}

interface LanguageSkill {
  language: string;
  spoken: string;
  written: string;
  understand: string;
}

interface FormData {
  position: string;
  expectedSalary: string;
  titleName: string;
  firstName: string;
  lastName: string;
  nickname: string;
  presentAddress: string;
  moo: string;
  district: string;
  subDistrict: string;
  province: string;
  zipCode: string;
  mobilePhone: string;
  email: string;
  birthDate: string;
  age: string;
  idCard: string;
  sex: string;
  bloodType: string;
  religion: string;
  height: string;
  weight: string;
  maritalStatus: string;
  spouseName: string;
  spouseOccupation: string;
  numberOfChildren: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyAddress: string;
  emergencyPhone: string;
  computerSkill: boolean;
  drivingCar: boolean;
  drivingCarLicenseNo: string;
  drivingMotorcycle: boolean;
  drivingMotorcycleLicenseNo: string;
  otherSkills: string;
  trainingCurriculums: string;
  workedAtICPBefore: string;
  workedAtICPDetails: string;
  relativesAtICP: string;
  relativesAtICPDetails: string;
  criminalRecord: string;
  criminalRecordDetails: string;
  seriousIllness: string;
  seriousIllnessDetails: string;
  colorBlindness: string;
  pregnant: string;
  contagiousDisease: string;
  privacyConsent: boolean;
}

interface ApplicationFormData {
  formData: FormData;
  educations: Education[];
  workExperiences: WorkExperience[];
  familyMembers: FamilyMember[];
  languageSkills: LanguageSkill[];
  photoUrl?: string;
  resumeUrl?: string;
  submittedAt: string;
}

const getEducationLevelLabel = (level: string): string => {
  const labels: Record<string, string> = {
    'high-school': 'High School / มัธยมศึกษา',
    'diploma': 'Diploma / อนุปริญญา',
    'bachelor': 'Bachelor / ปริญญาตรี',
    'master': 'Master / ปริญญาโท',
    'others': 'Others / อื่นๆ',
  };
  return labels[level] || level;
};

const getLanguageProficiencyLabel = (level: string): string => {
  const labels: Record<string, string> = {
    'excellent': 'ดีมาก / Excellent',
    'good': 'ดี / Good',
    'fair': 'พอใช้ / Fair',
    'no': 'ไม่ได้ / No',
  };
  return labels[level] || level || '-';
};

export function generateApplicationFormHTML(data: ApplicationFormData): string {
  const { formData, educations, workExperiences, familyMembers, languageSkills, photoUrl, resumeUrl, submittedAt } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ใบสมัครงาน - ${formData.firstName} ${formData.lastName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Sarabun', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .header h2 {
      font-size: 1.5rem;
      font-weight: 400;
      opacity: 0.9;
    }

    .header .submitted-date {
      margin-top: 16px;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .content {
      padding: 40px;
    }

    .section {
      margin-bottom: 32px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .section-header {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      font-size: 1.2rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-header .icon {
      width: 28px;
      height: 28px;
      background: rgba(255,255,255,0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .section-content {
      padding: 24px;
    }

    .profile-section {
      display: flex;
      gap: 32px;
      align-items: flex-start;
    }

    .profile-photo {
      flex-shrink: 0;
    }

    .profile-photo img {
      width: 150px;
      height: 200px;
      object-fit: cover;
      border-radius: 12px;
      border: 4px solid #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .profile-photo .no-photo {
      width: 150px;
      height: 200px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 4rem;
      font-weight: bold;
    }

    .profile-info {
      flex: 1;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .info-grid.three-cols {
      grid-template-columns: repeat(3, 1fr);
    }

    .info-grid.four-cols {
      grid-template-columns: repeat(4, 1fr);
    }

    .info-item {
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-label {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .info-value {
      font-size: 1rem;
      font-weight: 500;
      color: #1f2937;
    }

    .record-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      background: #fafafa;
    }

    .record-card:last-child {
      margin-bottom: 0;
    }

    .record-card h4 {
      color: #667eea;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #667eea;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #f0fdf4;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .checkbox-item.unchecked {
      background: #fef2f2;
    }

    .checkbox-icon {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .checkbox-icon.checked {
      background: #22c55e;
      color: white;
    }

    .checkbox-icon.unchecked {
      background: #ef4444;
      color: white;
    }

    .question-item {
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 4px solid #667eea;
    }

    .question-item:last-child {
      margin-bottom: 0;
    }

    .question-text {
      font-weight: 500;
      margin-bottom: 8px;
    }

    .answer-text {
      color: #667eea;
      font-weight: 600;
    }

    .answer-details {
      margin-top: 8px;
      padding: 8px 12px;
      background: white;
      border-radius: 4px;
      font-style: italic;
      color: #6b7280;
    }

    .footer {
      background: #f8fafc;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }

    .footer .declaration {
      font-size: 0.85rem;
      color: #6b7280;
      max-width: 700px;
      margin: 0 auto 16px;
      line-height: 1.8;
    }

    .footer .consent-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      border-radius: 50px;
      font-weight: 600;
    }

    .resume-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      margin-top: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .resume-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .container {
        box-shadow: none;
        border-radius: 0;
      }

      .section {
        break-inside: avoid;
      }
    }

    @media (max-width: 768px) {
      .profile-section {
        flex-direction: column;
        align-items: center;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .info-grid.three-cols,
      .info-grid.four-cols {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EMPLOYMENT APPLICATION</h1>
      <h2>ใบสมัครงาน</h2>
      <div class="submitted-date">
        วันที่ส่งใบสมัคร: ${formatDate(submittedAt)}
      </div>
    </div>

    <div class="content">
      <!-- Position & Salary -->
      <div class="section">
        <div class="section-header">
          <div class="icon">💼</div>
          Position & Salary / ตำแหน่งและเงินเดือน
        </div>
        <div class="section-content">
          <div class="profile-section">
            <div class="profile-photo">
              ${photoUrl
                ? `<img src="${photoUrl}" alt="Profile Photo" />`
                : `<div class="no-photo">${formData.firstName.charAt(0)}</div>`
              }
            </div>
            <div class="profile-info">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Position Applied / ตำแหน่งที่สมัคร</div>
                  <div class="info-value">${formData.position || '-'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Expected Salary / เงินเดือนที่คาดหวัง</div>
                  <div class="info-value">${formData.expectedSalary ? `${Number(formData.expectedSalary).toLocaleString()} บาท` : '-'}</div>
                </div>
              </div>
              ${resumeUrl ? `
              <a href="${resumeUrl}" target="_blank" class="resume-link">
                📄 ดู Resume / CV
              </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Record -->
      <div class="section">
        <div class="section-header">
          <div class="icon">👤</div>
          Personal Record / ประวัติส่วนตัว
        </div>
        <div class="section-content">
          <div class="info-grid three-cols">
            <div class="info-item">
              <div class="info-label">Title / คำนำหน้า</div>
              <div class="info-value">${formData.titleName || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Name / ชื่อ</div>
              <div class="info-value">${formData.firstName || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Last Name / นามสกุล</div>
              <div class="info-value">${formData.lastName || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Nickname / ชื่อเล่น</div>
              <div class="info-value">${formData.nickname || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Mobile Phone / โทรศัพท์</div>
              <div class="info-value">${formData.mobilePhone || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">E-mail / อีเมล</div>
              <div class="info-value">${formData.email || '-'}</div>
            </div>
          </div>

          <div class="info-grid" style="margin-top: 16px;">
            <div class="info-item full-width">
              <div class="info-label">Present Address / ที่อยู่ปัจจุบัน</div>
              <div class="info-value">
                ${formData.presentAddress || '-'}
                ${formData.moo ? `, หมู่ ${formData.moo}` : ''}
                ${formData.district ? `, ต.${formData.district}` : ''}
                ${formData.subDistrict ? `, อ.${formData.subDistrict}` : ''}
                ${formData.province ? `, จ.${formData.province}` : ''}
                ${formData.zipCode ? ` ${formData.zipCode}` : ''}
              </div>
            </div>
          </div>

          <div class="info-grid four-cols" style="margin-top: 16px;">
            <div class="info-item">
              <div class="info-label">Date of Birth / วันเกิด</div>
              <div class="info-value">${formatDate(formData.birthDate)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Age / อายุ</div>
              <div class="info-value">${formData.age ? `${formData.age} ปี` : '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Sex / เพศ</div>
              <div class="info-value">${formData.sex === 'male' ? 'ชาย / Male' : formData.sex === 'female' ? 'หญิง / Female' : '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Blood Type / กรุ๊ปเลือด</div>
              <div class="info-value">${formData.bloodType || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">ID Card No. / เลขบัตรประชาชน</div>
              <div class="info-value">${formData.idCard || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Religion / ศาสนา</div>
              <div class="info-value">${formData.religion || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Height / ส่วนสูง</div>
              <div class="info-value">${formData.height ? `${formData.height} cm` : '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Weight / น้ำหนัก</div>
              <div class="info-value">${formData.weight ? `${formData.weight} kg` : '-'}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Family Record -->
      <div class="section">
        <div class="section-header">
          <div class="icon">👨‍👩‍👧‍👦</div>
          Family Record / ประวัติครอบครัว
        </div>
        <div class="section-content">
          ${familyMembers.map((member, index) => `
          <div class="record-card">
            <h4>สมาชิกครอบครัวที่ ${index + 1}</h4>
            <div class="info-grid four-cols">
              <div class="info-item">
                <div class="info-label">Name / ชื่อ</div>
                <div class="info-value">${member.name || '-'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Relationship / ความสัมพันธ์</div>
                <div class="info-value">${member.relationship || '-'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Age / อายุ</div>
                <div class="info-value">${member.age ? `${member.age} ปี` : '-'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Occupation / อาชีพ</div>
                <div class="info-value">${member.occupation || '-'}</div>
              </div>
            </div>
          </div>
          `).join('')}
        </div>
      </div>

      <!-- Marital Status -->
      <div class="section">
        <div class="section-header">
          <div class="icon">💍</div>
          Marital Status / สถานภาพสมรส
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Status / สถานภาพ</div>
              <div class="info-value">${formData.maritalStatus === 'single' ? 'โสด / Single' : 'แต่งงาน / Married'}</div>
            </div>
            ${formData.maritalStatus === 'married' ? `
            <div class="info-item">
              <div class="info-label">Spouse's Name / ชื่อคู่สมรส</div>
              <div class="info-value">${formData.spouseName || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Spouse's Occupation / อาชีพคู่สมรส</div>
              <div class="info-value">${formData.spouseOccupation || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">No. of Children / จำนวนบุตร</div>
              <div class="info-value">${formData.numberOfChildren || '-'}</div>
            </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Emergency Contact -->
      <div class="section">
        <div class="section-header">
          <div class="icon">🚨</div>
          Emergency Contact / บุคคลติดต่อกรณีฉุกเฉิน
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Name / ชื่อ</div>
              <div class="info-value">${formData.emergencyName || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Relationship / ความสัมพันธ์</div>
              <div class="info-value">${formData.emergencyRelation || '-'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Mobile Phone / โทรศัพท์</div>
              <div class="info-value">${formData.emergencyPhone || '-'}</div>
            </div>
            <div class="info-item full-width">
              <div class="info-label">Address / ที่อยู่</div>
              <div class="info-value">${formData.emergencyAddress || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Educational Record -->
      <div class="section">
        <div class="section-header">
          <div class="icon">🎓</div>
          Educational Record / ประวัติการศึกษา
        </div>
        <div class="section-content">
          ${educations.filter(edu => edu.institution || edu.major || edu.yearGraduated).map(edu => `
          <div class="record-card">
            <h4>${getEducationLevelLabel(edu.level)}</h4>
            <div class="info-grid four-cols">
              <div class="info-item">
                <div class="info-label">Year Graduated / ปีที่จบ</div>
                <div class="info-value">${edu.yearGraduated || '-'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Institution / สถาบัน</div>
                <div class="info-value">${edu.institution || '-'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Major / สาขา</div>
                <div class="info-value">${edu.major || '-'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">G.P.A</div>
                <div class="info-value">${edu.gpa || '-'}</div>
              </div>
            </div>
          </div>
          `).join('') || '<p style="color: #6b7280; text-align: center;">ไม่มีข้อมูลการศึกษา</p>'}
        </div>
      </div>

      <!-- Language Skills -->
      <div class="section">
        <div class="section-header">
          <div class="icon">🌐</div>
          Foreign Languages / ภาษาต่างประเทศ
        </div>
        <div class="section-content">
          ${languageSkills.filter(lang => lang.language).map((lang, index) => `
          <div class="record-card">
            <h4>ภาษาที่ ${index + 1}: ${lang.language || '-'}</h4>
            <div class="info-grid three-cols">
              <div class="info-item">
                <div class="info-label">Spoken / พูด</div>
                <div class="info-value">${getLanguageProficiencyLabel(lang.spoken)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Written / เขียน</div>
                <div class="info-value">${getLanguageProficiencyLabel(lang.written)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Understand / เข้าใจ</div>
                <div class="info-value">${getLanguageProficiencyLabel(lang.understand)}</div>
              </div>
            </div>
          </div>
          `).join('') || '<p style="color: #6b7280; text-align: center;">ไม่มีข้อมูลทักษะภาษา</p>'}
        </div>
      </div>

      <!-- Special Skills -->
      <div class="section">
        <div class="section-header">
          <div class="icon">⭐</div>
          Special Skills / ความสามารถพิเศษ
        </div>
        <div class="section-content">
          <div class="checkbox-item ${formData.computerSkill ? '' : 'unchecked'}">
            <div class="checkbox-icon ${formData.computerSkill ? 'checked' : 'unchecked'}">
              ${formData.computerSkill ? '✓' : '✕'}
            </div>
            <span>Computer / คอมพิวเตอร์</span>
          </div>
          <div class="checkbox-item ${formData.drivingCar ? '' : 'unchecked'}">
            <div class="checkbox-icon ${formData.drivingCar ? 'checked' : 'unchecked'}">
              ${formData.drivingCar ? '✓' : '✕'}
            </div>
            <span>Driving Car / ขับรถยนต์ ${formData.drivingCarLicenseNo ? `(ใบขับขี่: ${formData.drivingCarLicenseNo})` : ''}</span>
          </div>
          <div class="checkbox-item ${formData.drivingMotorcycle ? '' : 'unchecked'}">
            <div class="checkbox-icon ${formData.drivingMotorcycle ? 'checked' : 'unchecked'}">
              ${formData.drivingMotorcycle ? '✓' : '✕'}
            </div>
            <span>Driving Motorcycle / ขับจักรยานยนต์ ${formData.drivingMotorcycleLicenseNo ? `(ใบขับขี่: ${formData.drivingMotorcycleLicenseNo})` : ''}</span>
          </div>
          ${formData.otherSkills ? `
          <div class="info-item full-width" style="margin-top: 16px;">
            <div class="info-label">Other Skills / ทักษะอื่นๆ</div>
            <div class="info-value">${formData.otherSkills}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Professional Training -->
      ${formData.trainingCurriculums ? `
      <div class="section">
        <div class="section-header">
          <div class="icon">📚</div>
          Professional Training / ประวัติการฝึกอบรม
        </div>
        <div class="section-content">
          <div class="info-item full-width">
            <div class="info-value" style="white-space: pre-wrap;">${formData.trainingCurriculums}</div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Employment Record -->
      <div class="section">
        <div class="section-header">
          <div class="icon">💼</div>
          Employment Record / ประวัติการทำงาน
        </div>
        <div class="section-content">
          ${workExperiences.filter(work => work.company || work.position).map((work, index) => `
          <div class="record-card">
            <h4>ประสบการณ์ที่ ${index + 1}</h4>
            <div class="info-grid three-cols">
              <div class="info-item">
                <div class="info-label">Period / ระยะเวลา</div>
                <div class="info-value">${work.duration || '-'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Company / บริษัท</div>
                <div class="info-value">${work.company || '-'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Position / ตำแหน่ง</div>
                <div class="info-value">${work.position || '-'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Salary / เงินเดือน</div>
                <div class="info-value">${work.salary || '-'}</div>
              </div>
              <div class="info-item" style="grid-column: span 2;">
                <div class="info-label">Responsibilities / หน้าที่</div>
                <div class="info-value">${work.responsibilities || '-'}</div>
              </div>
              <div class="info-item full-width">
                <div class="info-label">Reason for Leaving / เหตุผลที่ลาออก</div>
                <div class="info-value">${work.reason || '-'}</div>
              </div>
            </div>
          </div>
          `).join('') || '<p style="color: #6b7280; text-align: center;">ไม่มีประวัติการทำงาน</p>'}
        </div>
      </div>

      <!-- Other Questions -->
      <div class="section">
        <div class="section-header">
          <div class="icon">❓</div>
          Other Information / ข้อมูลอื่นๆ
        </div>
        <div class="section-content">
          <div class="question-item">
            <div class="question-text">1. Have you ever applied or worked with ICP Group before? / เคยสมัครหรือทำงานในกลุ่ม ICP มาก่อนหรือไม่?</div>
            <div class="answer-text">${formData.workedAtICPBefore === 'yes' ? 'เคย / Yes' : formData.workedAtICPBefore === 'no' ? 'ไม่เคย / No' : '-'}</div>
            ${formData.workedAtICPDetails ? `<div class="answer-details">${formData.workedAtICPDetails}</div>` : ''}
          </div>

          <div class="question-item">
            <div class="question-text">2. Do you have any relatives or friends working in ICP Group? / มีญาติหรือคนรู้จักทำงานในกลุ่ม ICP หรือไม่?</div>
            <div class="answer-text">${formData.relativesAtICP === 'yes' ? 'มี / Yes' : formData.relativesAtICP === 'no' ? 'ไม่มี / No' : '-'}</div>
            ${formData.relativesAtICPDetails ? `<div class="answer-details">${formData.relativesAtICPDetails}</div>` : ''}
          </div>

          <div class="question-item">
            <div class="question-text">3. Have you ever been convicted for any crimes? / เคยถูกตัดสินดำเนินคดีหรือไม่?</div>
            <div class="answer-text">${formData.criminalRecord === 'yes' ? 'เคย / Yes' : formData.criminalRecord === 'no' ? 'ไม่เคย / No' : '-'}</div>
            ${formData.criminalRecordDetails ? `<div class="answer-details">${formData.criminalRecordDetails}</div>` : ''}
          </div>

          <div class="question-item">
            <div class="question-text">4. Have you ever been seriously ill within the past 5 years? / ใน 5 ปีที่ผ่านมา เคยป่วยเป็นโรคร้ายแรงหรือไม่?</div>
            <div class="answer-text">${formData.seriousIllness === 'yes' ? 'เคย / Yes' : formData.seriousIllness === 'no' ? 'ไม่เคย / No' : '-'}</div>
            ${formData.seriousIllnessDetails ? `<div class="answer-details">${formData.seriousIllnessDetails}</div>` : ''}
          </div>

          <div class="question-item">
            <div class="question-text">5. Do you have color blindness? / มีภาวะตาบอดสีหรือไม่?</div>
            <div class="answer-text">${formData.colorBlindness === 'yes' ? 'มี / Yes' : formData.colorBlindness === 'no' ? 'ไม่มี / No' : '-'}</div>
          </div>

          <div class="question-item">
            <div class="question-text">6. Are you pregnant at the moment? / ขณะนี้ตั้งครรภ์หรือไม่?</div>
            <div class="answer-text">${formData.pregnant === 'yes' ? 'มี / Yes' : formData.pregnant === 'no' ? 'ไม่มี / No' : '-'}</div>
          </div>

          <div class="question-item">
            <div class="question-text">7. Have you ever contracted with contagious disease? / เคยป่วยเป็นโรคติดต่อร้ายแรงหรือไม่?</div>
            <div class="answer-text">${formData.contagiousDisease === 'yes' ? 'เคย / Yes' : formData.contagiousDisease === 'no' ? 'ไม่เคย / No' : '-'}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="declaration">
        <strong>I understand that any falsified statement on this application can be sufficient cause for dismissal if I am employed.</strong><br/>
        ข้าพเจ้าขอรับรองว่าข้อความข้างต้นเป็นความจริงทุกประการ การปิดบังความจริงใดๆ จะทำให้ข้าพเจ้าหมดสิทธิในการได้รับการพิจารณาจ้างงานหรือถูกปลดออกจากงานในกรณีบริษัทฯ ได้ว่าจ้างข้าพเจ้าแล้ว
      </div>
      <div class="consent-badge">
        ✓ ยินยอมตามนโยบายความเป็นส่วนตัว
      </div>
    </div>
  </div>
</body>
</html>`;
}
