variable "aws-access-key" {
  type = string
}

variable "aws-secret-key" {
  type = string
}

variable "aws-region" {
  type = string
}

variable "admin-username" {
  type = string
}

variable "admin-password" {
  type = string
}

variable "admin-fullname" {
  type = string
}

variable "admin-email" {
  type = string
}

variable "remote-repo" {
  type = string
}

variable "job-name" {
  type = string
}

variable "secrets" {
  type = map(string)
}
variable "db_username" {
  description = "The username for the MySQL RDS instance"
  type        = string
}

variable "db_password" {
  description = "The password for the MySQL RDS instance"
  type        = string
}
