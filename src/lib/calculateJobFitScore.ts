/**
 * Calculate job fit score between candidate and job position
 * Returns a score from 0-100 based on matching criteria
 */

interface JobPosition {
  title: string;
  department: string;
  location?: string;
  employment_type?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  min_education?: string;
  min_experience?: string;
  salary_min?: number;
  salary_max?: number;
}

interface Candidate {
  position_title?: string;
  education?: string;
  experience_years?: number;
  skills?: string[];
  expected_salary?: number;
  resume_text?: string;
  cover_letter?: string;
}

export function calculateJobFitScore(candidate: Candidate, job: JobPosition): number {
  let totalScore = 0;
  let maxScore = 0;

  // 1. ประสบการณ์ทำงานที่ตรงกับตำแหน่งงาน (65 points)
  maxScore += 65;
  
  // 1.1 Position Title Match (30 points)
  if (candidate.position_title && job.title) {
    const candidateTitle = candidate.position_title.toLowerCase();
    const jobTitle = job.title.toLowerCase();
    
    if (candidateTitle === jobTitle) {
      totalScore += 30;
    } else if (candidateTitle.includes(jobTitle) || jobTitle.includes(candidateTitle)) {
      totalScore += 23;
    } else {
      // Check for keyword overlap
      const candidateWords = candidateTitle.split(/\s+/);
      const jobWords = jobTitle.split(/\s+/);
      const matchingWords = candidateWords.filter(word => 
        jobWords.some(jw => jw.includes(word) || word.includes(jw))
      );
      totalScore += Math.min(15, matchingWords.length * 4);
    }
  }
  
  // 1.2 Years of Experience Match (35 points)
  if (candidate.experience_years !== undefined && job.requirements) {
    const expMatch = job.requirements.match(/(\d+)\s*(?:ปี|year)/i);
    if (expMatch) {
      const requiredYears = parseInt(expMatch[1]);
      if (candidate.experience_years >= requiredYears) {
        totalScore += 35;
      } else if (candidate.experience_years >= requiredYears * 0.8) {
        totalScore += 28;
      } else if (candidate.experience_years >= requiredYears * 0.6) {
        totalScore += 21;
      } else if (candidate.experience_years >= requiredYears * 0.4) {
        totalScore += 14;
      } else {
        totalScore += 7;
      }
    } else {
      // No specific requirement, give score based on years
      totalScore += Math.min(30, candidate.experience_years * 3);
    }
  }

  // 2. คุณสมบัติ (10 points)
  maxScore += 10;
  if (candidate.resume_text || candidate.cover_letter) {
    const text = (candidate.resume_text || '') + ' ' + (candidate.cover_letter || '');
    const wordCount = text.split(/\s+/).length;
    
    // Check for quality indicators
    const hasAchievements = text.toLowerCase().includes('achievement') || 
                           text.toLowerCase().includes('award') ||
                           text.includes('รางวัล') || 
                           text.includes('ผลงาน');
    
    if (wordCount > 200 && hasAchievements) {
      totalScore += 10;
    } else if (wordCount > 150) {
      totalScore += 8;
    } else if (wordCount > 100) {
      totalScore += 6;
    } else if (wordCount > 50) {
      totalScore += 4;
    } else {
      totalScore += 2;
    }
  }

  // 3. วุฒิการศึกษา (10 points)
  maxScore += 10;
  if (candidate.education && job.requirements) {
    const education = candidate.education.toLowerCase();
    const requirements = job.requirements.toLowerCase();
    
    if (requirements.includes('ปริญญาเอก') || requirements.includes('phd') || requirements.includes('doctorate')) {
      if (education.includes('ปริญญาเอก') || education.includes('phd') || education.includes('doctorate')) {
        totalScore += 10;
      } else if (education.includes('ปริญญาโท') || education.includes('master')) {
        totalScore += 8;
      } else if (education.includes('ปริญญาตรี') || education.includes('bachelor')) {
        totalScore += 6;
      }
    } else if (requirements.includes('ปริญญาโท') || requirements.includes('master')) {
      if (education.includes('ปริญญาเอก') || education.includes('phd')) {
        totalScore += 10;
      } else if (education.includes('ปริญญาโท') || education.includes('master')) {
        totalScore += 10;
      } else if (education.includes('ปริญญาตรี') || education.includes('bachelor')) {
        totalScore += 7;
      }
    } else if (requirements.includes('ปริญญาตรี') || requirements.includes('bachelor')) {
      if (education.includes('ปริญญาเอก') || education.includes('phd')) {
        totalScore += 10;
      } else if (education.includes('ปริญญาโท') || education.includes('master')) {
        totalScore += 10;
      } else if (education.includes('ปริญญาตรี') || education.includes('bachelor')) {
        totalScore += 10;
      } else if (education.includes('ปวส') || education.includes('diploma')) {
        totalScore += 6;
      }
    } else {
      // No specific requirement
      if (education.includes('ปริญญา') || education.includes('bachelor') || education.includes('master')) {
        totalScore += 8;
      }
    }
  }

  // 4. ทักษะและความสามารถอื่น ๆ (15 points)
  maxScore += 15;
  if (candidate.skills && candidate.skills.length > 0 && job.requirements) {
    const requirements = job.requirements.toLowerCase();
    const matchingSkills = candidate.skills.filter(skill => 
      requirements.includes(skill.toLowerCase())
    );
    
    const skillMatchRatio = matchingSkills.length / Math.max(candidate.skills.length, 1);
    totalScore += Math.round(skillMatchRatio * 15);
  } else if (candidate.resume_text && job.requirements) {
    // Fallback: check resume text for keywords
    const resumeText = candidate.resume_text.toLowerCase();
    const requirements = job.requirements.toLowerCase();
    
    const keywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'database', 
                     'management', 'leadership', 'communication', 'teamwork', 'project',
                     'excel', 'powerpoint', 'word', 'english', 'ภาษาอังกฤษ'];
    
    const matchingKeywords = keywords.filter(keyword => 
      resumeText.includes(keyword) && requirements.includes(keyword)
    );
    
    totalScore += Math.min(15, matchingKeywords.length * 2);
  }

  // Calculate percentage
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, percentage));
}

/**
 * Get score color class based on score value
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return 'from-green-500 to-emerald-600';
  if (score >= 80) return 'from-blue-500 to-cyan-600';
  if (score >= 70) return 'from-yellow-500 to-orange-500';
  if (score >= 60) return 'from-orange-500 to-red-500';
  return 'from-gray-400 to-gray-500';
}

/**
 * Get score label based on score value
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'ยอดเยี่ยม';
  if (score >= 80) return 'ดีมาก';
  if (score >= 70) return 'ดี';
  if (score >= 60) return 'พอใช้';
  return 'ต่ำ';
}
