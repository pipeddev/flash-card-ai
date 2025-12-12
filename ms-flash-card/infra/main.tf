########################################
# Habilitar APIs necesarias
########################################

resource "google_project_service" "run" {
  project = var.project_id
  service = "run.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "artifactregistry" {
  project = var.project_id
  service = "artifactregistry.googleapis.com"

  disable_on_destroy = false
}

########################################
# Service Account para Cloud Run
########################################

resource "google_service_account" "cloud_run_sa" {
  account_id   = "${var.service_name}-sa"
  display_name = "Service Account for ${var.service_name}"
}

########################################
# Cloud Run (v2) Service
########################################

resource "google_cloud_run_v2_service" "this" {
  name     = var.service_name
  project  = var.project_id
  location = var.region

  ingress = "INGRESS_TRAFFIC_ALL"
  deletion_protection = false

  template {
    service_account = google_service_account.cloud_run_sa.email

    containers {
      image = var.image

      env {
        name  = "OPENAI_API_KEY"
        value = var.openai_api_key
      }

      env {
        name  = "GEMINI_API_KEY"
        value = var.gemini_api_key
      }

      env {
        name  = "GEMINI_MODEL"
        value = var.gemini_model
      }

      env {
        name  = "OPENAI_MODEL"
        value = var.openai_model
      }

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  depends_on = [
    google_project_service.run,
    google_project_service.artifactregistry,
  ]
}

########################################
# Hacer el servicio público (invocación sin auth)
########################################

data "google_iam_policy" "noauth" {
  binding {
    role    = "roles/run.invoker"
    members = ["allUsers"]
  }
}

resource "google_cloud_run_v2_service_iam_policy" "noauth" {
  project  = google_cloud_run_v2_service.this.project
  location = google_cloud_run_v2_service.this.location
  name     = google_cloud_run_v2_service.this.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

########################################
# Outputs
########################################

output "cloud_run_url" {
  description = "URL pública del servicio de Cloud Run"
  value       = google_cloud_run_v2_service.this.uri
}
