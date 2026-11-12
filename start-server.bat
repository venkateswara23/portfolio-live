@echo off
TITLE Timmareddy Venkateswara Reddy - Java Portfolio Server
color 0A

echo ======================================================================
echo   🚀 TIMMAREDDY VENKATESWARA REDDY - JAVA PORTFOLIO SERVER
echo   Vellore Institute of Technology - Andhra Pradesh (VIT-AP)
echo ======================================================================
echo.

REM Create bin directory if not present
if not exist "bin" mkdir bin

echo [*] Compiling Java backend classes...
javac -encoding UTF-8 -d bin src\main\java\com\portfolio\models\*.java src\main\java\com\portfolio\*.java

if %ERRORLEVEL% NEQ 0 (
    echo [!] Compilation failed. Please check your JDK installation.
    pause
    exit /b %ERRORLEVEL%
)

echo [OK] Compilation successful!
echo.
echo [*] Launching Java Portfolio Server on port 8080...
echo.
echo  -------------------------------------------------------------
echo   🌐 Portfolio URL : http://localhost:8080/
echo   🔐 Login URL     : http://localhost:8080/login.html
echo   ⚙️ Admin URL     : http://localhost:8080/admin.html
echo   📈 Health Probe  : http://localhost:8080/health
echo   🔥 Metrics (Prom): http://localhost:8080/metrics
echo   📊 ELK Log Stream: http://localhost:8080/api/elk/logs
echo   📁 Local Log File: logs\portfolio-elk.log
echo  -------------------------------------------------------------
echo   Fixed Demo Credentials:
echo     Username / Email : venkateswara
echo     Password         : vitap2028
echo     Admin Access     : admin / admin123
echo  -------------------------------------------------------------
echo.

java -cp bin com.portfolio.PortfolioServer 8080

pause
