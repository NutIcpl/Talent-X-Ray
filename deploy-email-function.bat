@echo off
echo Deploying send-email-with-attachments Edge Function...
npx supabase functions deploy send-email-with-attachments --no-verify-jwt
echo.
echo Done! Please check the logs in Supabase Dashboard.
pause
