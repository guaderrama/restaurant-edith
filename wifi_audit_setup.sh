#!/bin/bash
# ============================================
# Script de Auditoría WiFi - Para tu propia red
# Creado para Ivan - Flipper Zero + WiFi Dev Board
# ============================================

set -e

echo "=========================================="
echo "  PREPARACIÓN DE AUDITORÍA WIFI"
echo "  Solo para tu propia red - uso legal"
echo "=========================================="
echo ""

# Detectar sistema operativo
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
else
    echo "Sistema no soportado. Usa Linux o Mac."
    exit 1
fi

echo "[1/4] Instalando herramientas..."
if [ "$OS" == "linux" ]; then
    sudo apt update
    sudo apt install -y hashcat aircrack-ng wget
elif [ "$OS" == "mac" ]; then
    brew install hashcat aircrack-ng wget
fi

echo "[2/4] Creando directorio de trabajo..."
mkdir -p ~/wifi_audit
cd ~/wifi_audit

echo "[3/4] Descargando diccionario rockyou..."
if [ ! -f "rockyou.txt" ]; then
    wget -q --show-progress https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt
    echo "Diccionario descargado (14 millones de contraseñas comunes)"
else
    echo "Diccionario ya existe"
fi

echo "[4/4] Creando script de cracking..."
cat > crack_wifi.sh << 'CRACKSCRIPT'
#!/bin/bash
# Uso: ./crack_wifi.sh archivo.pcap

if [ -z "$1" ]; then
    echo "Uso: ./crack_wifi.sh <archivo.pcap>"
    echo "Ejemplo: ./crack_wifi.sh captura.pcap"
    exit 1
fi

CAPTURA="$1"

echo "Convirtiendo captura a formato hashcat..."
hcxpcapngtool -o hash.hc22000 "$CAPTURA" 2>/dev/null || \
    aircrack-ng -J hash "$CAPTURA"

if [ -f "hash.hc22000" ]; then
    echo "Iniciando cracking con hashcat..."
    hashcat -m 22000 hash.hc22000 rockyou.txt --force
elif [ -f "hash.hccapx" ]; then
    echo "Iniciando cracking con hashcat (formato antiguo)..."
    hashcat -m 2500 hash.hccapx rockyou.txt --force
else
    echo "Usando aircrack-ng..."
    aircrack-ng -w rockyou.txt "$CAPTURA"
fi
CRACKSCRIPT
chmod +x crack_wifi.sh

echo ""
echo "=========================================="
echo "  ¡LISTO!"
echo "=========================================="
echo ""
echo "Directorio de trabajo: ~/wifi_audit"
echo ""
echo "PRÓXIMOS PASOS:"
echo "1. Captura el handshake con tu Flipper"
echo "2. Copia el archivo .pcap a ~/wifi_audit"
echo "3. Ejecuta: cd ~/wifi_audit && ./crack_wifi.sh tu_archivo.pcap"
echo ""
echo "Si tu contraseña aparece = ES DÉBIL, cámbiala"
echo "Si no aparece después de 1 hora = Está bien protegida"
echo ""
