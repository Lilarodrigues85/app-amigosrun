# Script para deploy do sistema de aprovação

Write-Host "🚀 Deploy do Sistema de Aprovação - Amigos Run" -ForegroundColor Cyan
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

# Perguntar o que fazer
Write-Host "O que deseja fazer?" -ForegroundColor Cyan
Write-Host "1. Deploy apenas das Firestore Rules" -ForegroundColor White
Write-Host "2. Deploy completo (Rules + Hosting)" -ForegroundColor White
Write-Host "3. Apenas build (sem deploy)" -ForegroundColor White
Write-Host ""

$opcao = Read-Host "Digite o número da opção"

switch ($opcao) {
    "1" {
        Write-Host ""
        Write-Host "📤 Fazendo deploy das Firestore Rules..." -ForegroundColor Cyan
        firebase deploy --only firestore:rules
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Firestore Rules deployadas com sucesso!" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  IMPORTANTE: Não esqueça de adicionar um admin!" -ForegroundColor Yellow
            Write-Host "Execute: .\setup-admin.ps1" -ForegroundColor White
        } else {
            Write-Host ""
            Write-Host "❌ Erro ao fazer deploy das rules" -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🔨 Fazendo build da aplicação..." -ForegroundColor Cyan
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Build concluído!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📤 Fazendo deploy completo..." -ForegroundColor Cyan
            firebase deploy
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "✅ Deploy completo realizado com sucesso!" -ForegroundColor Green
                Write-Host ""
                Write-Host "⚠️  IMPORTANTE: Não esqueça de adicionar um admin!" -ForegroundColor Yellow
                Write-Host "Execute: .\setup-admin.ps1" -ForegroundColor White
            } else {
                Write-Host ""
                Write-Host "❌ Erro ao fazer deploy" -ForegroundColor Red
            }
        } else {
            Write-Host ""
            Write-Host "❌ Erro no build" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "🔨 Fazendo build da aplicação..." -ForegroundColor Cyan
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Para fazer deploy, execute:" -ForegroundColor Yellow
            Write-Host "firebase deploy" -ForegroundColor White
        } else {
            Write-Host ""
            Write-Host "❌ Erro no build" -ForegroundColor Red
        }
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
