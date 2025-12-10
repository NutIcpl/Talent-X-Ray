# 🚨 ต้อง Deploy ก่อนใช้งาน!

## ปัญหาที่พบ
❌ Edge Function `parse-resume` ยังไม่ได้ Deploy หรือใช้ Model เก่าอยู่
❌ Error 500: Internal Server Error

## แก้ไขแล้ว
✅ เปลี่ยนจาก `clever-api` เป็น `parse-resume` (ชื่อที่ถูกต้อง)
✅ อัพเกรด Model เป็น Gemini 2.0 Flash Thinking แล้ว

## ⚡ Deploy ทันที (3 คำสั่ง)

```bash
# 1. Login
npx supabase login

# 2. Deploy ทั้งหมด
npx supabase functions deploy

# 3. ตรวจสอบ
npx supabase functions list
```

## หรือ Deploy ทีละตัว

```bash
npx supabase functions deploy parse-resume
npx supabase functions deploy parse-jd-document
npx supabase functions deploy calculate-fit-score
```

## ตรวจสอบ API Key

```bash
# ดู secrets
npx supabase secrets list

# ถ้ายังไม่มี ให้ตั้งค่า
npx supabase secrets set OPENAI_API_KEY=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
```

## หลัง Deploy แล้ว

1. Refresh browser (F5)
2. ลองอัพโหลด Resume อีกครั้ง
3. กด "Parse Resume with AI"
4. ✅ ควรทำงานได้แล้ว!

## ถ้ายังไม่ได้

ดู logs:
```bash
npx supabase functions logs parse-resume
```

---

**สำคัญ:** ต้อง Deploy ก่อนถึงจะใช้ AI Model ใหม่ได้!
