output "rds_mysql_endpoint" {
  value = aws_db_instance.rds_mysql_instance.endpoint
}

output "rds_mysql_port" {
  value = aws_db_instance.rds_mysql_instance.port
}

output "rds_mysql_username" {
  value = aws_db_instance.rds_mysql_instance.username
}

output "rds_mysql_password" {
  value = aws_db_instance.rds_mysql_instance.password
}