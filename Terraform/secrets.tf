resource "aws_secretsmanager_secret" "course-api" {
  name = "course-api"
}

resource "aws_secretsmanager_secret_version" "course-api" {
  secret_id     = aws_secretsmanager_secret.course-api.id
  secret_string = jsonencode(var.secrets)
}
#
#resource "aws_secretsmanager_secret" "mysql-user" {
#  name = "mysql-user"
#}
#
#resource "aws_secretsmanager_secret_version" "mysql-user" {
#  secret_id     = aws_secretsmanager_secret.mysql-user.id
#  secret_string = var.db_username
#}
#
#
#resource "aws_secretsmanager_secret" "mysql-pw" {
#  name = "mysql-user"
#}
#
#resource "aws_secretsmanager_secret_version" "mysql-pw" {
#  secret_id     = aws_secretsmanager_secret.mysql-user.id
#  secret_string = var.db_password
#}
#
#resource "aws_secretsmanager_secret" "mysql-user" {
#  name = "mysql-user"
#}
#
#resource "aws_secretsmanager_secret_version" "mysql-user" {
#  secret_id     = aws_secretsmanager_secret.mysql-user.id
#  secret_string = var.db_username
#}
#
#
#resource "aws_secretsmanager_secret" "mysql-pw" {
#  name = "mysql-user"
#}
#
#resource "aws_secretsmanager_secret_version" "mysql-pw" {
#  secret_id     = aws_secretsmanager_secret.mysql-user.id
#  secret_string = var.db_password
#}