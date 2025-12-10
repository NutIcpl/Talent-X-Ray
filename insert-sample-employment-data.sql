-- Insert sample employment records
-- Replace 'pmetheechutikul@gmail.com' with the actual candidate email if different

INSERT INTO public.employment_records (candidate_id, period_time, company, position, responsibilities, salary, reason_for_leaving)
SELECT 
  c.id,
  '2020-2023 (3 ปี)',
  'ABC Technology Co., Ltd.',
  'Senior Software Engineer',
  'พัฒนาระบบ Web Application ด้วย React และ Node.js
- ออกแบบและพัฒนา RESTful API
- ทำงานร่วมกับทีม UX/UI Designer
- Code Review และ Mentoring Junior Developer',
  45000,
  'ต้องการความก้าวหน้าในสายงาน'
FROM public.candidates c
WHERE c.email = 'pmetheechutikul@gmail.com'
LIMIT 1;

INSERT INTO public.employment_records (candidate_id, period_time, company, position, responsibilities, salary, reason_for_leaving)
SELECT 
  c.id,
  '2018-2020 (2 ปี)',
  'XYZ Solutions Ltd.',
  'Software Developer',
  'พัฒนาและดูแลระบบ ERP
- แก้ไข Bug และปรับปรุงระบบ
- ทำงานร่วมกับทีม QA
- เขียน Documentation',
  35000,
  'ต้องการเรียนรู้เทคโนโลยีใหม่'
FROM public.candidates c
WHERE c.email = 'pmetheechutikul@gmail.com'
LIMIT 1;
