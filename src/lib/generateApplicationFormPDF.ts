// Function to generate PDF application form from form data
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SarabunRegular, SarabunBold } from './fonts/Sarabun';

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
    'excellent': 'ดีมาก',
    'good': 'ดี',
    'fair': 'พอใช้',
    'no': 'ไม่ได้',
  };
  return labels[level] || level || '-';
};

// Load Thai font (Sarabun)
const loadThaiFont = (doc: jsPDF) => {
  // Add Sarabun fonts to VFS
  doc.addFileToVFS('Sarabun-Regular.ttf', SarabunRegular);
  doc.addFileToVFS('Sarabun-Bold.ttf', SarabunBold);

  // Register fonts
  doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal');
  doc.addFont('Sarabun-Bold.ttf', 'Sarabun', 'bold');

  // Set default font
  doc.setFont('Sarabun', 'normal');
};

export async function generateApplicationFormPDF(data: ApplicationFormData): Promise<Blob> {
  const { formData, educations, workExperiences, familyMembers, languageSkills, photoUrl, submittedAt } = data;

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  // Helper functions
  const addNewPageIfNeeded = (requiredSpace: number = 30) => {
    if (yPos + requiredSpace > 280) {
      doc.addPage();
      yPos = 20;
    }
  };

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

  // Load font
  loadThaiFont(doc);

  // Header
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('Sarabun', 'bold');
  doc.text('ใบสมัครงาน', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('Sarabun', 'normal');
  doc.text('Employment Application Form', pageWidth / 2, 24, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`วันที่ส่ง: ${formatDate(submittedAt)}`, pageWidth / 2, 32, { align: 'center' });

  yPos = 45;
  doc.setTextColor(0, 0, 0);

  // Photo placeholder (if exists)
  if (photoUrl) {
    try {
      // Create image from URL
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = photoUrl;
      });
      doc.addImage(img, 'JPEG', margin, yPos, 30, 40);
    } catch (e) {
      // Draw placeholder if image fails
      doc.setDrawColor(102, 126, 234);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPos, 30, 40);
      doc.setFontSize(8);
      doc.text('Photo', margin + 15, yPos + 22, { align: 'center' });
    }
  } else {
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, 30, 40);
    doc.setFontSize(24);
    doc.setTextColor(102, 126, 234);
    doc.text(formData.firstName.charAt(0) || '?', margin + 15, yPos + 27, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }

  // Position & Basic Info (next to photo)
  const infoX = margin + 40;
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('ตำแหน่งที่สมัคร:', infoX, yPos + 8);
  doc.setFont('Sarabun', 'normal');
  doc.text(formData.position || '-', infoX + 35, yPos + 8);

  doc.setFont('Sarabun', 'bold');
  doc.text('เงินเดือนที่ต้องการ:', infoX, yPos + 16);
  doc.setFont('Sarabun', 'normal');
  doc.text(formData.expectedSalary ? `${Number(formData.expectedSalary).toLocaleString()} บาท` : '-', infoX + 40, yPos + 16);

  doc.setFont('Sarabun', 'bold');
  doc.text('ชื่อ-นามสกุล:', infoX, yPos + 24);
  doc.setFont('Sarabun', 'normal');
  doc.text(`${formData.titleName} ${formData.firstName} ${formData.lastName}`, infoX + 30, yPos + 24);

  doc.setFont('Sarabun', 'bold');
  doc.text('อีเมล:', infoX, yPos + 32);
  doc.setFont('Sarabun', 'normal');
  doc.text(formData.email || '-', infoX + 15, yPos + 32);

  doc.setFont('Sarabun', 'bold');
  doc.text('โทรศัพท์:', infoX, yPos + 40);
  doc.setFont('Sarabun', 'normal');
  doc.text(formData.mobilePhone || '-', infoX + 22, yPos + 40);

  yPos += 50;

  // Section: Personal Information
  addNewPageIfNeeded(60);
  doc.setFillColor(102, 126, 234);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('ข้อมูลส่วนตัว', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  const personalData = [
    ['ชื่อเล่น', formData.nickname || '-', 'วันเกิด', formatDate(formData.birthDate)],
    ['อายุ', formData.age ? `${formData.age} ปี` : '-', 'เพศ', formData.sex === 'male' ? 'ชาย' : formData.sex === 'female' ? 'หญิง' : '-'],
    ['เลขบัตรประชาชน', formData.idCard || '-', 'กรุ๊ปเลือด', formData.bloodType || '-'],
    ['ศาสนา', formData.religion || '-', 'ส่วนสูง/น้ำหนัก', `${formData.height || '-'} ซม. / ${formData.weight || '-'} กก.`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: personalData,
    theme: 'grid',
    styles: { fontSize: 12, cellPadding: 2, font: 'Sarabun' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 30 },
      1: { cellWidth: 55 },
      2: { fontStyle: 'bold', cellWidth: 30 },
      3: { cellWidth: 55 },
    },
    margin: { left: margin, right: margin },
  });
  yPos = (doc as any).lastAutoTable.finalY + 5;

  // Address
  doc.setFontSize(12);
  doc.setFont('Sarabun', 'bold');
  doc.text('ที่อยู่:', margin, yPos + 4);
  doc.setFont('Sarabun', 'normal');
  const address = `${formData.presentAddress || ''}${formData.moo ? ` หมู่ ${formData.moo}` : ''}${formData.subDistrict ? ` ต.${formData.subDistrict}` : ''}${formData.district ? ` อ.${formData.district}` : ''}${formData.province ? ` จ.${formData.province}` : ''}${formData.zipCode ? ` ${formData.zipCode}` : ''}`;
  doc.text(address || '-', margin + 15, yPos + 4);
  yPos += 10;

  // Section: Family Members
  addNewPageIfNeeded(40);
  doc.setFillColor(102, 126, 234);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('ข้อมูลครอบครัว', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  const familyData = familyMembers
    .filter(m => m.name)
    .map(m => [m.name, m.relationship, m.age ? `${m.age} ปี` : '-', m.occupation || '-']);

  if (familyData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['ชื่อ-นามสกุล', 'ความสัมพันธ์', 'อายุ', 'อาชีพ']],
      body: familyData,
      theme: 'striped',
      styles: { fontSize: 12, cellPadding: 2, font: 'Sarabun' },
      headStyles: { fillColor: [102, 126, 234], font: 'Sarabun' },
      margin: { left: margin, right: margin },
    });
    yPos = (doc as any).lastAutoTable.finalY + 5;
  } else {
    doc.setFontSize(12);
    doc.text('ไม่มีข้อมูลครอบครัว', margin, yPos + 4);
    yPos += 10;
  }

  // Section: Marital Status
  addNewPageIfNeeded(25);
  doc.setFillColor(102, 126, 234);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('สถานภาพสมรส', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  doc.setFontSize(12);
  doc.setFont('Sarabun', 'bold');
  doc.text('สถานภาพ:', margin, yPos + 4);
  doc.setFont('Sarabun', 'normal');
  doc.text(formData.maritalStatus === 'single' ? 'โสด' : 'สมรส', margin + 25, yPos + 4);

  if (formData.maritalStatus === 'married') {
    doc.setFont('Sarabun', 'bold');
    doc.text('คู่สมรส:', margin + 50, yPos + 4);
    doc.setFont('Sarabun', 'normal');
    doc.text(formData.spouseName || '-', margin + 70, yPos + 4);

    doc.setFont('Sarabun', 'bold');
    doc.text('จำนวนบุตร:', margin + 120, yPos + 4);
    doc.setFont('Sarabun', 'normal');
    doc.text(formData.numberOfChildren || '-', margin + 145, yPos + 4);
  }
  yPos += 10;

  // Section: Emergency Contact
  addNewPageIfNeeded(25);
  doc.setFillColor(102, 126, 234);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('ผู้ติดต่อฉุกเฉิน', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  const emergencyData = [
    ['ชื่อ', formData.emergencyName || '-', 'ความสัมพันธ์', formData.emergencyRelation || '-'],
    ['โทรศัพท์', formData.emergencyPhone || '-', 'ที่อยู่', formData.emergencyAddress || '-'],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: emergencyData,
    theme: 'grid',
    styles: { fontSize: 12, cellPadding: 2, font: 'Sarabun' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 25 },
      1: { cellWidth: 60 },
      2: { fontStyle: 'bold', cellWidth: 25 },
      3: { cellWidth: 60 },
    },
    margin: { left: margin, right: margin },
  });
  yPos = (doc as any).lastAutoTable.finalY + 5;

  // Section: Education
  addNewPageIfNeeded(40);
  doc.setFillColor(102, 126, 234);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('ประวัติการศึกษา', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  const eduData = educations
    .filter(e => e.institution || e.major)
    .map(e => [getEducationLevelLabel(e.level), e.institution || '-', e.major || '-', e.yearGraduated || '-', e.gpa || '-']);

  if (eduData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['ระดับ', 'สถาบัน', 'สาขา', 'ปีที่จบ', 'เกรด']],
      body: eduData,
      theme: 'striped',
      styles: { fontSize: 11, cellPadding: 2, font: 'Sarabun' },
      headStyles: { fillColor: [102, 126, 234], font: 'Sarabun' },
      margin: { left: margin, right: margin },
    });
    yPos = (doc as any).lastAutoTable.finalY + 5;
  } else {
    doc.setFontSize(12);
    doc.text('ไม่มีข้อมูลการศึกษา', margin, yPos + 4);
    yPos += 10;
  }

  // Section: Language Skills
  addNewPageIfNeeded(35);
  doc.setFillColor(102, 126, 234);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('ทักษะภาษา', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  const langData = languageSkills
    .filter(l => l.language)
    .map(l => [l.language, getLanguageProficiencyLabel(l.spoken), getLanguageProficiencyLabel(l.written), getLanguageProficiencyLabel(l.understand)]);

  if (langData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['ภาษา', 'พูด', 'เขียน', 'เข้าใจ']],
      body: langData,
      theme: 'striped',
      styles: { fontSize: 12, cellPadding: 2, font: 'Sarabun' },
      headStyles: { fillColor: [102, 126, 234], font: 'Sarabun' },
      margin: { left: margin, right: margin },
    });
    yPos = (doc as any).lastAutoTable.finalY + 5;
  } else {
    doc.setFontSize(12);
    doc.text('ไม่มีข้อมูลทักษะภาษา', margin, yPos + 4);
    yPos += 10;
  }

  // Section: Special Skills
  addNewPageIfNeeded(30);
  doc.setFillColor(102, 126, 234);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('ทักษะพิเศษ', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  doc.setFontSize(12);
  const skills = [];
  if (formData.computerSkill) skills.push('คอมพิวเตอร์');
  if (formData.drivingCar) skills.push(`ขับรถยนต์${formData.drivingCarLicenseNo ? ` (${formData.drivingCarLicenseNo})` : ''}`);
  if (formData.drivingMotorcycle) skills.push(`ขับมอเตอร์ไซค์${formData.drivingMotorcycleLicenseNo ? ` (${formData.drivingMotorcycleLicenseNo})` : ''}`);

  doc.text(`ทักษะ: ${skills.length > 0 ? skills.join(', ') : '-'}`, margin, yPos + 4);
  yPos += 8;

  if (formData.otherSkills) {
    doc.text(`อื่นๆ: ${formData.otherSkills}`, margin, yPos + 4);
    yPos += 8;
  }

  if (formData.trainingCurriculums) {
    doc.text(`การฝึกอบรม: ${formData.trainingCurriculums}`, margin, yPos + 4);
    yPos += 8;
  }

  // Section: Employment Record
  addNewPageIfNeeded(50);
  doc.setFillColor(102, 126, 234);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('ประวัติการทำงาน', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  const workData = workExperiences
    .filter(w => w.company || w.position)
    .map(w => [w.duration || '-', w.company || '-', w.position || '-', w.salary || '-', w.reason || '-']);

  if (workData.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['ระยะเวลา', 'บริษัท', 'ตำแหน่ง', 'เงินเดือน', 'เหตุผลที่ลาออก']],
      body: workData,
      theme: 'striped',
      styles: { fontSize: 11, cellPadding: 2, font: 'Sarabun' },
      headStyles: { fillColor: [102, 126, 234], font: 'Sarabun' },
      margin: { left: margin, right: margin },
    });
    yPos = (doc as any).lastAutoTable.finalY + 5;

    // Add responsibilities for each work experience
    workExperiences.filter(w => w.responsibilities).forEach((w, idx) => {
      addNewPageIfNeeded(20);
      doc.setFontSize(11);
      doc.setFont('Sarabun', 'bold');
      doc.text(`หน้าที่รับผิดชอบ (${w.company || `งานที่ ${idx + 1}`}):`, margin, yPos + 4);
      doc.setFont('Sarabun', 'normal');

      const splitText = doc.splitTextToSize(w.responsibilities, pageWidth - margin * 2 - 5);
      doc.text(splitText, margin + 5, yPos + 10);
      yPos += 10 + (splitText.length * 4);
    });
  } else {
    doc.setFontSize(12);
    doc.text('ไม่มีประวัติการทำงาน', margin, yPos + 4);
    yPos += 10;
  }

  // Section: Other Information
  addNewPageIfNeeded(60);
  doc.setFillColor(102, 126, 234);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('Sarabun', 'bold');
  doc.text('ข้อมูลอื่นๆ', margin + 3, yPos + 6);
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  const otherData = [
    ['เคยทำงานที่ ICP มาก่อนหรือไม่?', formData.workedAtICPBefore === 'yes' ? 'ใช่' : 'ไม่'],
    ['มีญาติที่ ICP หรือไม่?', formData.relativesAtICP === 'yes' ? 'ใช่' : 'ไม่'],
    ['มีประวัติอาชญากรรมหรือไม่?', formData.criminalRecord === 'yes' ? 'ใช่' : 'ไม่'],
    ['เจ็บป่วยร้ายแรงใน 5 ปีที่ผ่านมา?', formData.seriousIllness === 'yes' ? 'ใช่' : 'ไม่'],
    ['ตาบอดสีหรือไม่?', formData.colorBlindness === 'yes' ? 'ใช่' : 'ไม่'],
    ['ตั้งครรภ์อยู่หรือไม่?', formData.pregnant === 'yes' ? 'ใช่' : 'ไม่'],
    ['มีโรคติดต่อหรือไม่?', formData.contagiousDisease === 'yes' ? 'ใช่' : 'ไม่'],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: otherData,
    theme: 'grid',
    styles: { fontSize: 12, cellPadding: 2, font: 'Sarabun' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 90 },
    },
    margin: { left: margin, right: margin },
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Footer - Declaration
  addNewPageIfNeeded(30);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPos, pageWidth - margin * 2, 25, 'F');

  doc.setFontSize(11);
  doc.setFont('Sarabun', 'normal');
  const declaration = 'ข้าพเจ้าขอรับรองว่าข้อความที่กรอกในใบสมัครนี้เป็นความจริงทุกประการ หากตรวจพบว่าเป็นเท็จ ข้าพเจ้ายินยอมให้บริษัทเลิกจ้างได้ทันที';
  doc.text(declaration, pageWidth / 2, yPos + 8, { align: 'center', maxWidth: pageWidth - margin * 2 - 10 });

  doc.setFont('Sarabun', 'bold');
  doc.setTextColor(34, 197, 94);
  doc.text('ยอมรับนโยบายความเป็นส่วนตัว', pageWidth / 2, yPos + 20, { align: 'center' });

  // Return as blob
  return doc.output('blob');
}
