@echo off
setlocal enabledelayedexpansion

REM Enhanced Firebase Setup for ClinicalForge
REM This script automates the complete Firebase setup process

echo ================================
echo Enhanced Firebase Setup for ClinicalForge
echo ================================
echo.

REM Parse command line arguments
set SETUP_TYPE=production
if "%1"=="--dev" set SETUP_TYPE=development
if "%1"=="-d" set SETUP_TYPE=development
if "%1"=="--help" goto :help
if "%1"=="-h" goto :help

echo [INFO] Setup type: %SETUP_TYPE%
echo.

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    exit /b 1
)
echo [SUCCESS] Node.js is installed

REM Check if npm is installed
echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)
echo [SUCCESS] npm is installed

REM Check if Firebase CLI is installed
echo [INFO] Checking Firebase CLI installation...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Firebase CLI is not installed. Installing now...
    npm install -g firebase-tools
    echo [SUCCESS] Firebase CLI installed
) else (
    echo [SUCCESS] Firebase CLI is installed
)

REM Check if user is logged into Firebase
echo [INFO] Checking Firebase authentication...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo [WARNING] You are not logged into Firebase. Please run:
    echo firebase login
    echo Then run this script again.
    exit /b 1
)
echo [SUCCESS] Firebase authentication verified

REM Install project dependencies
echo [INFO] Installing project dependencies...
npm install
echo [SUCCESS] Dependencies installed

REM Run the appropriate setup script
echo [INFO] Running Firebase setup...
if "%SETUP_TYPE%"=="development" (
    echo [INFO] Running development setup...
    npm run setup:firebase:quick
) else (
    echo [INFO] Running production setup...
    npm run setup:firebase
)

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.

if "%SETUP_TYPE%"=="development" (
    echo [SUCCESS] Development setup completed successfully!
    echo.
    echo [INFO] Next steps:
    echo 1. Run 'npm run dev:firebase:ui' to start development
    echo 2. Open http://localhost:3000 to test the application
    echo 3. Open http://localhost:4000 to view Firebase emulator UI
    echo 4. Test the forms at http://localhost:3000/forms
) else (
    echo [SUCCESS] Production setup completed successfully!
    echo.
    echo [INFO] Next steps:
    echo 1. Update your .env.local with actual Firebase credentials
    echo 2. Run 'npm run build' to build for production
    echo 3. Run 'npm run firebase:deploy' to deploy to Firebase
    echo 4. Test the forms in production
)

echo.
echo [INFO] For more information, see:
echo - FIREBASE_SETUP_GUIDE.md
echo - ENHANCED_CLINICAL_DATABASE_DESIGN.md
echo - DATABASE_IMPROVEMENTS_SUMMARY.md
echo.
echo [SUCCESS] Happy coding! 🚀
goto :end

:help
echo Enhanced Firebase Setup for ClinicalForge
echo.
echo Usage:
echo   setup-firebase.bat          # Production setup
echo   setup-firebase.bat --dev    # Development setup
echo   setup-firebase.bat -d       # Development setup (short)
echo   setup-firebase.bat --help   # Show this help
echo.
echo Options:
echo   --dev, -d    Run development setup with emulators
echo   --help, -h   Show this help message
echo.
echo Prerequisites:
echo   - Node.js (v16 or higher)
echo   - npm or yarn
echo   - Git (for version control)
echo.

:end 