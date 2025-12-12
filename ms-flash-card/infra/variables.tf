variable "project_id" {
  description = "ID del proyecto de GCP"
  type        = string
}

variable "region" {
  description = "Región para Cloud Run"
  type        = string
  default     = "southamerica-west1"
}

variable "service_name" {
  description = "Nombre del servicio de Cloud Run"
  type        = string
  default     = "ms-flash-card"
}

variable "image" {
  description = "Imagen de contenedor para desplegar en Cloud Run"
  type        = string
}

variable "openai_api_key" {
  description = "API key de OpenAI (solo demo, mejor usar Secret Manager en serio)"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "API key de Gemini (solo demo, mejor usar Secret Manager en serio)"
  type        = string
  sensitive   = true
}

variable "gemini_model" {
  description = "Modelo por defecto de Gemini"
  type        = string
  default     = "gemini-2.0-flash"
}

variable "openai_model" {
  description = "Modelo por defecto OpenAI"
  type        = string
  default     = "openai"
}
