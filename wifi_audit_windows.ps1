# ============================================
# Script de Auditoria WiFi para Windows
# Para Ivan - Flipper Zero + WiFi Dev Board
# ============================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  PREPARACION DE AUDITORIA WIFI" -ForegroundColor Cyan
Write-Host "  Solo para tu propia red - uso legal" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Crear directorio de trabajo
$workDir = "$env:USERPROFILE\wifi_audit"
if (!(Test-Path $workDir)) {
    New-Item -ItemType Directory -Path $workDir | Out-Null
}
Set-Location $workDir
Write-Host "[1/4] Directorio creado: $workDir" -ForegroundColor Green

# Descargar hashcat
Write-Host "[2/4] Descargando hashcat..." -ForegroundColor Yellow
$hashcatUrl = "https://hashcat.net/files/hashcat-6.2.6.7z"
$hashcatZip = "$workDir\hashcat.7z"
$hashcatDir = "$workDir\hashcat-6.2.6"

if (!(Test-Path $hashcatDir)) {
    Invoke-WebRequest -Uri $hashcatUrl -OutFile $hashcatZip
    Write-Host "   Extrayendo... (necesitas 7-Zip instalado)" -ForegroundColor Yellow
    & "C:\Program Files\7-Zip\7z.exe" x $hashcatZip -o"$workDir" -y | Out-Null
    Remove-Item $hashcatZip
}
Write-Host "   Hashcat listo" -ForegroundColor Green

# Descargar diccionario
Write-Host "[3/4] Descargando diccionario rockyou (133MB)..." -ForegroundColor Yellow
$rockyouPath = "$workDir\rockyou.txt"
if (!(Test-Path $rockyouPath)) {
    $rockyouUrl = "https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt"
    Invoke-WebRequest -Uri $rockyouUrl -OutFile $rockyouPath
}
Write-Host "   Diccionario listo (14 millones de passwords)" -ForegroundColor Green

# Crear script de cracking
Write-Host "[4/4] Creando script de cracking..." -ForegroundColor Yellow
$crackScript = @'
@echo off
echo ==========================================
echo   CRACKING DE HANDSHAKE WIFI
echo ==========================================
echo.

if "%~1"=="" (
    echo Uso: crack_wifi.bat archivo.pcap
    echo.
    echo Arrastra tu archivo .pcap sobre este script
    echo o ejecuta: crack_wifi.bat tu_archivo.pcap
    pause
    exit /b
)

set CAPTURA=%~1
set HASHCAT=hashcat-6.2.6\hashcat.exe

echo Archivo: %CAPTURA%
echo.
echo Convirtiendo y crackeando...
echo (Esto puede tardar desde minutos hasta horas)
echo.

%HASHCAT% -m 22000 "%CAPTURA%" rockyou.txt --force -O

echo.
echo ==========================================
if %ERRORLEVEL%==0 (
    echo RESULTADO: Revisa arriba si encontro la password
) else (
    echo Tu password NO esta en el diccionario comun
    echo Esto significa que es relativamente segura
)
echo ==========================================
pause
'@
$crackScript | Out-File -FilePath "$workDir\crack_wifi.bat" -Encoding ASCII

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  LISTO!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Carpeta de trabajo: $workDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Captura el handshake con tu Flipper Zero"
Write-Host "2. Copia el archivo .pcap a: $workDir"
Write-Host "3. Arrastra el .pcap sobre 'crack_wifi.bat'"
Write-Host "   O ejecuta: .\crack_wifi.bat tu_archivo.pcap"
Write-Host ""
Write-Host "NOTA: Necesitas tener 7-Zip instalado" -ForegroundColor Yellow
Write-Host "      https://7-zip.org/" -ForegroundColor Yellow
Write-Host ""

# Abrir la carpeta
explorer $workDir
