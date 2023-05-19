variable "engine" {
  default = "mysql"
  type = string
}
variable "identifier" {
  type = string
}
variable "engine_version" {
  default = "5.7"
  type = string
}
variable "instance_class" {
  type    = string
  default = "db.t2.micro"
}
variable "db_name" {
  type = string
}
variable "name" {
  type = string
}
variable "storage_type" {
  type = string
}
variable "allocated_storage" {
  type = number
}
variable "db_subnet_group_name" {
  type = string
}
variable "db_username" {
  description = "The username for the MySQL RDS instance"
  type = string
}
variable "db_password" {
  description = "The password for the MySQL RDS instance"
  type = string
}
variable "vpc_security_group_ids" {
  description = "The names of the security groups where the Redis instance will be deployed"
  type        = list(string)
}
variable "port" {
  default = "3306"
  type = string
}