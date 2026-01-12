# 🔥 Firebase Setup Script - Amigos Run (PowerShell)
# Script automatizado para configurar Firebase no Windows
# Uso: .\setup-firebase.ps1

param(
    [switch]$SkipInstall,
    [string]$ProjectId = "amigos-run"
)

# Cores para output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success($message) { Write-ColorOutput Green "✅ $message" }
function Write-Error($message) { Write-ColorOutput Red "❌ $message" }
function Write-Warning($message) { Write-ColorOutput Yellow "⚠️ $message" }
function Write-Info($message) { Write-ColorOutput Cyan "ℹ️ $message" }
function Write-Step($message) { Write-ColorOutput Magenta "🔄 $message" }

Write-ColorOutput White "🔥 Firebase Setup - Amigos Run"
Write-ColorOutput White "=================================="
Write-Output ""

# 1. Verificar Node.js
Write-Step "Verificando Node.js..."
try {
    $nodeVersion = node --version
    Write-Success "Node.js encontrado: $nodeVersion"
} catch {
    Write-Error "Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
}

# 2. Instalar Firebase CLI
if (-not $SkipInstall) {
    Write-Step "Instalando Firebase CLI..."
    try {
        npm install -g firebase-tools
        Write-Success "Firebase CLI instalado"
    } catch {
        Write-Error "Erro ao instalar Firebase CLI"
        exit 1
    }
}

# 3. Verificar Firebase CLI
Write-Step "Verificando Firebase CLI..."
try {
    $firebaseVersion = firebase --version
    Write-Success "Firebase CLI: $firebaseVersion"
} catch {
    Write-Error "Firebase CLI não encontrado"
    exit 1
}

# 4. Executar script Node.js
Write-Step "Executando configuração automática..."
if (Test-Path "setup-firebase.js") {
    node setup-firebase.js
    Write-Success "Configuração automática concluída"
} else {
    Write-Error "Arquivo setup-firebase.js não encontrado"
    exit 1
}

# 5. Verificar se Vue.js está instalado
Write-Step "Verificando projeto Vue.js..."
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.dependencies.vue) {
        Write-Success "Vue.js encontrado: $($packageJson.dependencies.vue)"
    } else {
        Write-Warning "Vue.js não encontrado no package.json"
    }
} else {
    Write-Warning "package.json não encontrado"
    Write-Info "Criando projeto Vue.js..."
    
    # Criar projeto Vue se não existir
    $createVue = Read-Host "Criar projeto Vue.js? (y/N)"
    if ($createVue -eq "y" -or $createVue -eq "Y") {
        npm create vue@latest . -- --typescript --router --pinia --vitest --eslint --prettier
        Write-Success "Projeto Vue.js criado"
    }
}

# 6. Instalar dependências do Firebase
Write-Step "Instalando dependências do Firebase..."
try {
    npm install firebase @vueuse/firebase @vueuse/core pinia leaflet
    Write-Success "Dependências instaladas"
} catch {
    Write-Error "Erro ao instalar dependências"
}

# 7. Fazer login no Firebase (opcional)
$login = Read-Host "Fazer login no Firebase agora? (y/N)"
if ($login -eq "y" -or $login -eq "Y") {
    Write-Step "Fazendo login no Firebase..."
    firebase login
}

# 8. Inicializar projeto Firebase (opcional)
$init = Read-Host "Inicializar projeto Firebase agora? (y/N)"
if ($init -eq "y" -or $init -eq "Y") {
    Write-Step "Inicializando projeto Firebase..."
    Write-Info "Selecione: Firestore, Hosting, Storage"
    Write-Info "Use arquivos existentes quando perguntado"
    firebase init
}

# 9. Instruções finais
Write-Output ""
Write-ColorOutput White "🎉 Setup concluído!"
Write-Output ""
Write-ColorOutput Yellow "📋 Próximos passos:"
Write-Output ""
Write-ColorOutput Cyan "1. Configure o arquivo .env:"
Write-Output "   - Abra .env no editor"
Write-Output "   - Adicione suas chaves do Firebase"
Write-Output "   - Cadastre-se em openweathermap.org"
Write-Output ""
Write-ColorOutput Cyan "2. Crie projeto no Firebase Console:"
Write-Output "   - Acesse: https://console.firebase.google.com"
Write-Output "   - Criar projeto: $ProjectId"
Write-Output "   - Habilitar: Auth, Firestore, Storage, Hosting"
Write-Output ""
Write-ColorOutput Cyan "3. Obter configuração do Firebase:"
Write-Output "   - Project Settings > General > Your apps"
Write-Output "   - Adicionar app web"
Write-Output "   - Copiar config para .env"
Write-Output ""
Write-ColorOutput Cyan "4. Comandos úteis:"
Write-Output "   npm run dev          # Executar em desenvolvimento"
Write-Output "   npm run build        # Build para produção"
Write-Output "   firebase serve       # Testar localmente"
Write-Output "   firebase deploy      # Deploy para produção"
Write-Output ""
Write-ColorOutput Green "🚀 Projeto Amigos Run pronto para desenvolvimento!"

# 10. Abrir arquivos importantes (opcional)
$openFiles = Read-Host "Abrir arquivos de configuração? (y/N)"
if ($openFiles -eq "y" -or $openFiles -eq "Y") {
    if (Test-Path ".env") { Start-Process notepad ".env" }
    if (Test-Path "src\firebase\config.js") { Start-Process notepad "src\firebase\config.js" }
    Write-Success "Arquivos abertos no Notepad"
}

Write-Output ""
Write-ColorOutput White "✨ Happy coding! 🏃‍♂️🏃‍♀️"