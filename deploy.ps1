# FortressFleet — Google Cloud Run & Pub/Sub Windows PowerShell Deployment Script
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🛡️ Deploying FortressFleet to Google Cloud Run (Scale-to-Zero)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check gcloud CLI
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: 'gcloud' CLI is not found in your PATH." -ForegroundColor Red
    Write-Host "Please install Google Cloud SDK or run this deployment in Google Cloud Shell (https://shell.cloud.google.com)." -ForegroundColor Yellow
    exit 1
}

# 2. Get / Set Project ID
$projectId = gcloud config get-value project 2>$null
if ([string]::IsNullOrWhiteSpace($projectId) -or $projectId -eq "(unset)") {
    $projectId = Read-Host "Enter your Google Cloud Project ID"
    gcloud config set project $projectId
}

$region = "us-central1"
$serviceName = "fortress-fleet"
$topicName = "fortress-fleet-events"
$subName = "fortress-fleet-sub"

Write-Host "📍 Target Project: $projectId" -ForegroundColor Green
Write-Host "📍 Target Region:  $region" -ForegroundColor Green

# 3. Enable GCP Services
Write-Host "`n🚀 Enabling GCP APIs (Cloud Run, Cloud Build, Pub/Sub)..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com cloudbuild.googleapis.com pubsub.googleapis.com artifactregistry.googleapis.com

# 4. Deploy to Cloud Run
Write-Host "`n📦 Building & Deploying FortressFleet Container to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $serviceName `
  --source . `
  --region $region `
  --platform managed `
  --allow-unauthenticated `
  --min-instances 0 `
  --max-instances 3 `
  --memory 512Mi `
  --cpu 1 `
  --port 8080 `
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1"

# 5. Retrieve URL
$serviceUrl = (gcloud run services describe $serviceName --platform managed --region $region --format 'value(status.url)').Trim()
Write-Host "`n✅ Cloud Run Service Deployed Successfully!" -ForegroundColor Green
Write-Host "🔗 Service URL: $serviceUrl" -ForegroundColor Green

# 6. Configure Pub/Sub Push Webhook
Write-Host "`n📡 Configuring Google Cloud Pub/Sub Webhook..." -ForegroundColor Cyan
$topicCheck = gcloud pubsub topics describe $topicName 2>$null
if (-not $topicCheck) {
    gcloud pubsub topics create $topicName
}

$webhookEndpoint = "$serviceUrl/api/webhooks/pubsub"
$subCheck = gcloud pubsub subscriptions describe $subName 2>$null
if (-not $subCheck) {
    gcloud pubsub subscriptions create $subName --topic $topicName --push-endpoint $webhookEndpoint --ack-deadline 30
} else {
    gcloud pubsub subscriptions update $subName --push-endpoint $webhookEndpoint
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "🎉 FortressFleet is LIVE on Google Cloud Platform!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🌐 App URL:     $serviceUrl" -ForegroundColor White
Write-Host "🩺 Health:      $serviceUrl/api/health" -ForegroundColor White
Write-Host "📡 Pub/Sub:     $webhookEndpoint (Topic: $topicName)" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
