resource "aws_db_instance" "rds_mysql_instance" {

  identifier             = var.identifier
  engine                 = var.engine
  engine_version         = var.engine_version
  instance_class         = var.instance_class
  allocated_storage      = var.allocated_storage
  storage_type           = var.storage_type
  db_subnet_group_name   = var.db_subnet_group_name
  vpc_security_group_ids = var.vpc_security_group_ids
#  db_username            = var.db_username
#  db_password            = var.db_password
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  port                   = var.port

  tags = {
    Name = "course-rds-mysql-instance"
    #    Name = var.name
  }
}