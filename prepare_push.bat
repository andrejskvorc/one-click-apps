@echo off
REM <summary>
REM Automates the execution of validation, formatting, and git deployment pipeline.
REM Prompts the user for a commit message before pushing to the remote repository.
REM Includes error handling to pause the console if a critical step fails.
REM </summary>

echo ========================================
echo 1. Running validation...
call npm run validate_apps
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Validation failed! Please check the logs above to fix the YAML formatting.
    pause
    exit /b %ERRORLEVEL%
)

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
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Git push failed! Please check if you need to run 'git pull' first.
    pause
    exit /b %ERRORLEVEL%
)

echo ========================================
echo All done! GitHub Actions are now building your apps.
echo.
pause