module "mysql" {
  source = "./mysql"

  identifier             = "course-rds-mysql-instance"
  engine                 = "mysql"
  engine_version         = "5.7"
  instance_class         = "db.t2.micro"
  allocated_storage      = 20
  storage_type           = "gp2"
  db_subnet_group_name   = aws_db_subnet_group.rds_mysql_subnet_group.name
  vpc_security_group_ids = [aws_security_group.allow-mysql-traffic.id]
  db_username            = var.db_username
  db_password            = var.db_password
  name                   = "course-rds-mysql-instance"
  db_name                = "demodb"
  port                   = "3306"
}