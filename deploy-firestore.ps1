# Script para Deploy do Firestore (Regras e Índices)
# Amigos Run - Feed de Posts

Write-Host "🔥 Deploy do Firestore - Amigos Run" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Firebase CLI está instalado
Write-Host "🔍 Verificando Firebase CLI..." -ForegroundColor Yellow
$firebaseVersion = firebase --version 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Firebase CLI não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instale com: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Firebase CLI instalado: $firebaseVersion" -ForegroundColor Green
Write-Host ""

# Verificar se está logado
Write-Host "🔍 Verificando autenticação..." -ForegroundColor Yellow
$currentUser = firebase projects:list 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não está autenticado no Firebase!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute: firebase login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Autenticado no Firebase" -ForegroundColor Green
Write-Host ""

# Menu de opções
Write-Host "Escolha o que deseja fazer:" -ForegroundColor Cyan
Write-Host "1. Deploy apenas das Regras (firestore.rules)" -ForegroundColor White
Write-Host "2. Deploy apenas dos Índices (firestore.indexes.json)" -ForegroundColor White
Write-Host "3. Deploy Completo (Regras + Índices)" -ForegroundColor White
Write-Host "4. Cancelar" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Digite sua escolha (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📤 Fazendo deploy das Regras do Firestore..." -ForegroundColor Yellow
        firebase deploy --only firestore:rules
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Regras deployadas com sucesso!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Erro ao fazer deploy das regras" -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "📤 Fazendo deploy dos Índices do Firestore..." -ForegroundColor Yellow
        Write-Host "⚠️  Os índices podem levar alguns minutos para serem criados" -ForegroundColor Yellow
        firebase deploy --only firestore:indexes
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Índices deployados com sucesso!" -ForegroundColor Green
            Write-Host "⏳ Aguarde alguns minutos para os índices serem criados" -ForegroundColor Yellow
        } else {
            Write-Host ""
            Write-Host "❌ Erro ao fazer deploy dos índices" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "📤 Fazendo deploy completo do Firestore..." -ForegroundColor Yellow
        Write-Host "⚠️  Os índices podem levar alguns minutos para serem criados" -ForegroundColor Yellow
        firebase deploy --only firestore
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Deploy completo realizado com sucesso!" -ForegroundColor Green
            Write-Host "✅ Regras deployadas" -ForegroundColor Green
            Write-Host "✅ Índices deployados (aguarde alguns minutos)" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Erro ao fazer deploy" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host ""
        Write-Host "❌ Deploy cancelado" -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🎉 Processo concluído!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Verifique no Firebase Console:" -ForegroundColor Yellow
Write-Host "https://console.firebase.google.com" -ForegroundColor Cyan
Write-Host ""
