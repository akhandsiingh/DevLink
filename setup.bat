@echo off
echo 🚀 Setting up DevLinker project...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

:: Install server dependencies
echo 📦 Installing server dependencies...
cd server
if exist package.json (
    npm install
    if %errorlevel% equ 0 (
        echo ✅ Server dependencies installed successfully
    ) else (
        echo ❌ Failed to install server dependencies
        pause
        exit /b 1
    )
) else (
    echo ❌ server/package.json not found
    pause
    exit /b 1
)

:: Install client dependencies
echo 📦 Installing client dependencies...
cd ..\client
if exist package.json (
    :: Clear npm cache and node_modules if they exist
    if exist node_modules (
        echo 🧹 Cleaning existing node_modules...
        rmdir /s /q node_modules
    )
    
    if exist package-lock.json (
        echo 🧹 Cleaning package-lock.json...
        del package-lock.json
    )
    
    :: Clear npm cache
    npm cache clean --force
    
    :: Install dependencies
    npm install
    if %errorlevel% equ 0 (
        echo ✅ Client dependencies installed successfully
    ) else (
        echo ❌ Failed to install client dependencies
        echo 🔄 Trying alternative installation method...
        npm install --legacy-peer-deps
        if %errorlevel% equ 0 (
            echo ✅ Client dependencies installed with legacy peer deps
        ) else (
            echo ❌ Failed to install client dependencies with all methods
            pause
            exit /b 1
        )
    )
) else (
    echo ❌ client/package.json not found
    pause
    exit /b 1
)

:: Go back to root directory
cd ..

:: Create environment files if they don't exist
echo ⚙️ Setting up environment files...

if not exist server\.env (
    echo 📝 Creating server/.env file...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo MONGO_URI=mongodb://localhost:27017/devlinker
        echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
        echo JWT_EXPIRE=30d
        echo.
        echo # External API Keys ^(Optional - add your own^)
        echo GITHUB_TOKEN=
        echo LINKEDIN_CLIENT_ID=
        echo LINKEDIN_CLIENT_SECRET=
        echo TWITTER_API_KEY=
        echo TWITTER_API_SECRET=
        echo TWITTER_BEARER_TOKEN=
        echo.
        echo # Email Configuration ^(Optional^)
        echo SMTP_HOST=
        echo SMTP_PORT=587
        echo SMTP_USER=
        echo SMTP_PASS=
        echo.
        echo # Redis Configuration ^(Optional^)
        echo REDIS_HOST=localhost
        echo REDIS_PORT=6379
    ) > server\.env
    echo ✅ Server environment file created
) else (
    echo ✅ Server environment file already exists
)

if not exist client\.env (
    echo 📝 Creating client/.env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000
        echo GENERATE_SOURCEMAP=false
        echo REACT_APP_VERSION=1.0.0
    ) > client\.env
    echo ✅ Client environment file created
) else (
    echo ✅ Client environment file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Make sure MongoDB is running on your system
echo 2. Update server/.env with your API keys ^(optional^)
echo 3. Start the development servers:
echo    cd server ^&^& npm run both
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo    API Docs: http://localhost:5000/api-docs
echo.
echo 🔧 Troubleshooting:
echo    - If React fails to start, try: cd client ^&^& npm install --force
echo    - If MongoDB connection fails, check your MongoDB installation
echo    - For API issues, check the server logs
echo.
pause
