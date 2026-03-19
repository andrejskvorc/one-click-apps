@echo off
REM <summary>
REM Automates the execution of validation, formatting, and git deployment pipeline.
REM Prompts the user for a commit message before pushing to the remote repository.
REM </summary>

echo ========================================
echo 1. Running validation...
call npm run validate_apps

echo ========================================
echo 2. Running formatter...
call npm run formatter-write

echo ========================================
echo 3. Staging files for commit...
git add .
set /p commit_msg="Enter commit message: "
git commit -m "%commit_msg%"

echo ========================================
echo 4. Pushing to GitHub...
git push

echo ========================================
echo All done! GitHub Actions are now building your apps.