@echo off
echo Deploying calculate-fit-score Edge Function...
npx supabase functions deploy calculate-fit-score --no-verify-jwt
echo.
echo Done! The new scoring formula is now active:
echo - Work Experience: 65%%
echo - Qualifications: 10%%
echo - Education: 10%%
echo - Skills: 15%%
pause
