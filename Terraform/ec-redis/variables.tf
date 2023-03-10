variable "project_name" {
  description = "course-api"
  type        = string
}
variable "cluster_id" {
  type = string
}
variable "engine_version" {
  default = "5.0.6"
  type    = string
}
variable "node_type" {
  default = "cache.t2.micro"
  type    = string
}
variable "parameter_group_name" {
  default = "default.redis5.0"
  type    = string
}
variable "port" {
  default = 6379
  type    = number
}
variable "subnet_group_name" {
  description = "The names of the private groups where the Redis instance will be deployed"
  type        = string
}
variable "engine" {
  default = "redis5"
  type    = string
}
variable "security_group_ids" {
  description = "The names of the security groups where the Redis instance will be deployed"
  type        = list(string)
}