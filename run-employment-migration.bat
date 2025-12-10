@echo off
echo Running employment_records migration...
echo.
echo This will create the employment_records table and add sample data.
echo.
pause

npx supabase db push

echo.
echo Migration completed!
echo.
echo The employment_records table has been created.
echo Sample data has been added for testing.
echo.
pause
