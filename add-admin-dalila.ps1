# Script PowerShell para adicionar admin Dalila

Write-Host "🔧 Adicionando Admin - Amigos Run" -ForegroundColor Cyan
Write-Host ""

$adminEmail = "dalila.analistadesistema@gmail.com"
$adminName = "Dalila"

Write-Host "📝 Admin a ser adicionado:" -ForegroundColor Cyan
Write-Host "   Email: $adminEmail" -ForegroundColor White
Write-Host "   Nome: $adminName" -ForegroundColor White
Write-Host ""

# Verificar se Node.js está instalado
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeInstalled) {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js encontrado" -ForegroundColor Green
Write-Host ""

# Verificar se dotenv está instalado
Write-Host "📦 Verificando dependências..." -ForegroundColor Cyan
$dotenvInstalled = Test-Path "node_modules/dotenv"
if (-not $dotenvInstalled) {
    Write-Host "⚠️  Instalando dotenv..." -ForegroundColor Yellow
    npm install dotenv
}

Write-Host ""
Write-Host "🚀 Executando script de adição..." -ForegroundColor Cyan
Write-Host ""

# Executar o script Node.js
node add-admin-dalila.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Admin adicionado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Faça login com: $adminEmail" -ForegroundColor White
    Write-Host "2. Acesse: http://localhost:5173/admin/users" -ForegroundColor White
    Write-Host "3. Gerencie os usuários pendentes" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Erro ao adicionar admin" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Adicione manualmente no Firebase Console:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://console.firebase.google.com" -ForegroundColor White
    Write-Host "2. Firestore Database → Iniciar coleção" -ForegroundColor White
    Write-Host "3. Collection ID: admins" -ForegroundColor White
    Write-Host "4. Document ID: $adminEmail" -ForegroundColor White
    Write-Host "5. Campos:" -ForegroundColor White
    Write-Host "   - email: $adminEmail" -ForegroundColor Gray
    Write-Host "   - role: admin" -ForegroundColor Gray
    Write-Host "   - name: $adminName" -ForegroundColor Gray
    Write-Host "   - createdAt: [timestamp atual]" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
