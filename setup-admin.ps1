# Script para configurar administradores no Firestore
# Execute este script para adicionar emails de administradores

Write-Host "🔧 Configuração de Administradores - Amigos Run" -ForegroundColor Cyan
Write-Host ""

# Verificar se Firebase CLI está instalado
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseInstalled) {
    Write-Host "❌ Firebase CLI não encontrado!" -ForegroundColor Red
    Write-Host "Instale com: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Firebase CLI encontrado" -ForegroundColor Green
Write-Host ""

# Login no Firebase
Write-Host "🔐 Fazendo login no Firebase..." -ForegroundColor Cyan
firebase login

Write-Host ""
Write-Host "📝 Digite o email do administrador:" -ForegroundColor Cyan
$adminEmail = Read-Host

if ([string]::IsNullOrWhiteSpace($adminEmail)) {
    Write-Host "❌ Email não pode ser vazio!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Digite o nome do administrador:" -ForegroundColor Cyan
$adminName = Read-Host

if ([string]::IsNullOrWhiteSpace($adminName)) {
    $adminName = "Administrador"
}

Write-Host ""
Write-Host "🚀 Criando documento de administrador..." -ForegroundColor Cyan
Write-Host "   Email: $adminEmail" -ForegroundColor White
Write-Host "   Nome: $adminName" -ForegroundColor White
Write-Host ""

# Criar arquivo temporário com os dados
$timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
$adminData = @"
{
  "email": "$adminEmail",
  "role": "admin",
  "name": "$adminName",
  "createdAt": "$timestamp"
}
"@

$tempFile = "temp-admin-data.json"
$adminData | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "📤 Enviando para Firestore..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Execute o seguinte comando no Console do Firebase:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Acesse: https://console.firebase.google.com" -ForegroundColor White
Write-Host "2. Selecione seu projeto" -ForegroundColor White
Write-Host "3. Vá em Firestore Database" -ForegroundColor White
Write-Host "4. Crie uma collection chamada 'admins'" -ForegroundColor White
Write-Host "5. Adicione um documento com ID: $adminEmail" -ForegroundColor White
Write-Host "6. Cole os dados do arquivo: $tempFile" -ForegroundColor White
Write-Host ""

Write-Host "📄 Conteúdo do arquivo $tempFile" ":" -ForegroundColor Cyan
Get-Content $tempFile
Write-Host ""

Write-Host "✅ Arquivo criado com sucesso!" -ForegroundColor Green
Write-Host "⚠️  Não esqueça de adicionar manualmente no Firebase Console" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Limpar arquivo temporário
Remove-Item $tempFile -ErrorAction SilentlyContinue
