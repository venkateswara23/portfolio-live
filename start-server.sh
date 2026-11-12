#!/usr/bin/env bash
# ======================================================================
# Timmareddy Venkateswara Reddy - Java Portfolio Server
# ======================================================================

set -e

mkdir -p bin

echo "[*] Compiling Java backend classes..."
javac -encoding UTF-8 -d bin src/main/java/com/portfolio/models/*.java src/main/java/com/portfolio/*.java

echo "[OK] Compilation successful!"
echo ""
echo "-------------------------------------------------------------"
echo "  🌐 Portfolio URL : http://localhost:8080/"
echo "  🔐 Login URL     : http://localhost:8080/login.html"
echo "  ⚙️ Admin URL     : http://localhost:8080/admin.html"
echo "-------------------------------------------------------------"
echo "  Fixed Demo Credentials:"
echo "    Username : venkateswara"
echo "    Password : vitap2028"
echo "    Admin    : admin / admin123"
echo "-------------------------------------------------------------"
echo ""

java -cp bin com.portfolio.PortfolioServer 8080
