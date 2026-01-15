@echo off
echo ==========================================
echo   INSTALADOR DE AUDITORIA WIFI
echo   Para tu propia red - uso legal
echo ==========================================
echo.
echo Ejecutando instalacion...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0wifi_audit_windows.ps1"
pause
