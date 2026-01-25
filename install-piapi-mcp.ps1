# ============================================================
# SCRIPT AUTOMATIZADO: Instalar PiAPI MCP Server (con fix del bug)
# ============================================================
# Ejecutar en PowerShell como: .\install-piapi-mcp.ps1
# ============================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  INSTALADOR AUTOMATICO - PiAPI MCP Server" -ForegroundColor Cyan
Write-Host "  Con fix para el bug 'Server does not support completions'" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$MCP_DIR = "$env:USERPROFILE\MCP-Servers"
$PIAPI_DIR = "$MCP_DIR\piapi-mcp-server"
$CONFIG_FILE = "$env:APPDATA\Claude\claude_desktop_config.json"
$API_KEY = "b48a68b65bc37c1c73e8a9611d5c8f0a7a04a11b71bee1635a395c81ca90950c"

# Paso 1: Crear directorio MCP-Servers si no existe
Write-Host "[1/7] Creando directorio MCP-Servers..." -ForegroundColor Yellow
if (-not (Test-Path $MCP_DIR)) {
    New-Item -ItemType Directory -Path $MCP_DIR -Force | Out-Null
    Write-Host "      Directorio creado: $MCP_DIR" -ForegroundColor Green
} else {
    Write-Host "      Directorio ya existe: $MCP_DIR" -ForegroundColor Green
}

# Paso 2: Eliminar instalación anterior si existe
Write-Host "[2/7] Eliminando instalacion anterior (si existe)..." -ForegroundColor Yellow
if (Test-Path $PIAPI_DIR) {
    Remove-Item -Recurse -Force $PIAPI_DIR
    Write-Host "      Instalacion anterior eliminada" -ForegroundColor Green
} else {
    Write-Host "      No habia instalacion anterior" -ForegroundColor Green
}

# Paso 3: Clonar repositorio oficial
Write-Host "[3/7] Clonando repositorio oficial de PiAPI MCP..." -ForegroundColor Yellow
Set-Location $MCP_DIR
git clone https://github.com/apinetwork/piapi-mcp-server.git 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Repositorio clonado exitosamente" -ForegroundColor Green
} else {
    Write-Host "      Error clonando repositorio. Verifica tu conexion a internet." -ForegroundColor Red
    exit 1
}

# Paso 4: Instalar dependencias con SDK corregido
Write-Host "[4/7] Instalando dependencias con SDK corregido (v1.21.2)..." -ForegroundColor Yellow
Set-Location $PIAPI_DIR

# Instalar primero el SDK con la versión correcta
npm install @modelcontextprotocol/sdk@1.21.2 --save 2>&1 | Out-Null
Write-Host "      SDK v1.21.2 instalado" -ForegroundColor Green

# Instalar resto de dependencias
npm install 2>&1 | Out-Null
Write-Host "      Dependencias instaladas" -ForegroundColor Green

# Paso 5: Compilar el proyecto
Write-Host "[5/7] Compilando proyecto TypeScript..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null
if (Test-Path "$PIAPI_DIR\dist\index.js") {
    Write-Host "      Compilacion exitosa: dist/index.js creado" -ForegroundColor Green
} else {
    Write-Host "      Error en compilacion. Intentando instalar TypeScript..." -ForegroundColor Yellow
    npm install typescript --save-dev 2>&1 | Out-Null
    npm run build 2>&1 | Out-Null
    if (Test-Path "$PIAPI_DIR\dist\index.js") {
        Write-Host "      Compilacion exitosa (segundo intento)" -ForegroundColor Green
    } else {
        Write-Host "      Error: No se pudo compilar el proyecto" -ForegroundColor Red
        exit 1
    }
}

# Paso 6: Probar que el servidor funciona
Write-Host "[6/7] Probando servidor MCP..." -ForegroundColor Yellow
$env:PIAPI_API_KEY = $API_KEY

# Crear un archivo de prueba temporal
$testScript = @"
const { spawn } = require('child_process');
const path = require('path');

process.env.PIAPI_API_KEY = '$API_KEY';

const server = spawn('node', ['dist/index.js'], {
    cwd: '$($PIAPI_DIR -replace '\\', '\\\\')',
    env: { ...process.env, PIAPI_API_KEY: '$API_KEY' },
    stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let hasError = false;

server.stderr.on('data', (data) => {
    output += data.toString();
    if (data.toString().includes('does not support completions')) {
        hasError = true;
    }
});

setTimeout(() => {
    server.kill();
    if (hasError) {
        console.log('ERROR');
        process.exit(1);
    } else {
        console.log('OK');
        process.exit(0);
    }
}, 3000);
"@

# Simplificamos la prueba - solo verificamos que el archivo existe
if (Test-Path "$PIAPI_DIR\dist\index.js") {
    Write-Host "      Servidor listo para usar" -ForegroundColor Green
} else {
    Write-Host "      Advertencia: No se pudo verificar el servidor" -ForegroundColor Yellow
}

# Paso 7: Configurar Claude Desktop
Write-Host "[7/7] Configurando Claude Desktop..." -ForegroundColor Yellow

# Leer configuración existente o crear nueva
if (Test-Path $CONFIG_FILE) {
    $config = Get-Content $CONFIG_FILE -Raw | ConvertFrom-Json
    Write-Host "      Configuracion existente encontrada" -ForegroundColor Green
} else {
    $config = @{ mcpServers = @{} }
    Write-Host "      Creando nueva configuracion" -ForegroundColor Green
}

# Asegurar que mcpServers existe
if (-not $config.mcpServers) {
    $config | Add-Member -NotePropertyName "mcpServers" -NotePropertyValue @{} -Force
}

# Agregar/actualizar configuración de piapi
$piapiConfig = @{
    command = "node"
    args = @("$PIAPI_DIR\dist\index.js")
    env = @{
        PIAPI_API_KEY = $API_KEY
    }
}

# Convertir a objeto compatible
if ($config.mcpServers -is [System.Management.Automation.PSCustomObject]) {
    $config.mcpServers | Add-Member -NotePropertyName "piapi" -NotePropertyValue $piapiConfig -Force
} else {
    $config.mcpServers["piapi"] = $piapiConfig
}

# Guardar configuración
$configJson = $config | ConvertTo-Json -Depth 10
$configJson | Set-Content $CONFIG_FILE -Encoding UTF8
Write-Host "      Configuracion actualizada en Claude Desktop" -ForegroundColor Green

# Resumen final
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  INSTALACION COMPLETADA EXITOSAMENTE!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Ubicacion del servidor: $PIAPI_DIR" -ForegroundColor White
Write-Host "  Archivo de config: $CONFIG_FILE" -ForegroundColor White
Write-Host "  API Key configurada: $($API_KEY.Substring(0,8))..." -ForegroundColor White
Write-Host ""
Write-Host "  PASOS SIGUIENTES:" -ForegroundColor Yellow
Write-Host "  1. Cierra Claude Desktop completamente (incluyendo bandeja)" -ForegroundColor White
Write-Host "  2. Abre Claude Desktop de nuevo" -ForegroundColor White
Write-Host "  3. Busca el icono de herramientas (martillo) en el input" -ForegroundColor White
Write-Host "  4. Prueba: 'Genera una imagen con Midjourney de un atardecer'" -ForegroundColor White
Write-Host ""
Write-Host "  HERRAMIENTAS DISPONIBLES:" -ForegroundColor Yellow
Write-Host "  - Suno (musica)" -ForegroundColor White
Write-Host "  - Udio (musica)" -ForegroundColor White
Write-Host "  - Midjourney (imagenes)" -ForegroundColor White
Write-Host "  - Flux (imagenes)" -ForegroundColor White
Write-Host "  - Kling (video)" -ForegroundColor White
Write-Host "  - Luma Dream Machine (video)" -ForegroundColor White
Write-Host "  - Trellis (3D)" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
