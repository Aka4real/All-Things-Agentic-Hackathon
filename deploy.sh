#!/usr/bin/env bash
# FortressFleet — Google Cloud Run & Pub/Sub One-Click Deployment Script
set -e

echo "=========================================================="
echo "🛡️ Deploying FortressFleet to Google Cloud Run (Scale-to-Zero)"
echo "=========================================================="

# 1. Check / Set GCP Project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
  read -p "Enter your Google Cloud Project ID: " PROJECT_ID
  gcloud config set project "$PROJECT_ID"
fi

REGION="us-central1"
SERVICE_NAME="fortress-fleet"
TOPIC_NAME="fortress-fleet-events"
SUBSCRIPTION_NAME="fortress-fleet-sub"

echo "📍 Target Project: $PROJECT_ID"
echo "📍 Target Region:  $REGION"

# 2. Enable Required Google Cloud APIs
echo ""
echo "🚀 Enabling GCP Services (Cloud Run, Cloud Build, Pub/Sub, Artifact Registry)..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  pubsub.googleapis.com \
  artifactregistry.googleapis.com

# 3. Deploy Application to Cloud Run from Source
echo ""
echo "📦 Building & Deploying FortressFleet Container to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 3 \
  --memory 512Mi \
  --cpu 1 \
  --port 8080 \
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1"

# 4. Retrieve Service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)')
echo ""
echo "✅ Cloud Run Service Deployed Successfully!"
echo "🔗 Service URL: $SERVICE_URL"

# 5. Create Cloud Pub/Sub Topic & Push Subscription
echo ""
echo "📡 Configuring Google Cloud Pub/Sub Webhook Integration..."
if ! gcloud pubsub topics describe "$TOPIC_NAME" >/dev/null 2>&1; then
  echo "Creating Pub/Sub Topic: $TOPIC_NAME"
  gcloud pubsub topics create "$TOPIC_NAME"
else
  echo "Pub/Sub Topic $TOPIC_NAME already exists."
fi

WEBHOOK_ENDPOINT="${SERVICE_URL}/api/webhooks/pubsub"

if ! gcloud pubsub subscriptions describe "$SUBSCRIPTION_NAME" >/dev/null 2>&1; then
  echo "Creating Pub/Sub Push Subscription pointing to: $WEBHOOK_ENDPOINT"
  gcloud pubsub subscriptions create "$SUBSCRIPTION_NAME" \
    --topic "$TOPIC_NAME" \
    --push-endpoint "$WEBHOOK_ENDPOINT" \
    --ack-deadline 30
else
  echo "Updating existing Pub/Sub Push Subscription endpoint to: $WEBHOOK_ENDPOINT"
  gcloud pubsub subscriptions update "$SUBSCRIPTION_NAME" \
    --push-endpoint "$WEBHOOK_ENDPOINT"
fi

# 6. Verify Health Endpoint
echo ""
echo "🩺 Verifying Health Check Endpoint..."
curl -s "${SERVICE_URL}/api/health" | grep -q "healthy" && echo "✅ Health check PASSED: ${SERVICE_URL}/api/health" || echo "⚠️ Check health check output manually"

echo ""
echo "=========================================================="
echo "🎉 FortressFleet is LIVE on Google Cloud Platform!"
echo "=========================================================="
echo "🌐 App URL:     $SERVICE_URL"
echo "🩺 Health:      $SERVICE_URL/api/health"
echo "📡 Pub/Sub:     $WEBHOOK_ENDPOINT (Topic: $TOPIC_NAME)"
echo "=========================================================="
