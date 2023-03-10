resource "aws_secretsmanager_secret" "course-api" {
  name = "course-api"
}

resource "aws_secretsmanager_secret_version" "course-api" {
  secret_id     = aws_secretsmanager_secret.course-api.id
  secret_string = jsonencode(var.secrets)
}