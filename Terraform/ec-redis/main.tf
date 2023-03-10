resource "aws_elasticache_cluster" "redis_cluster" {
  cluster_id           = var.cluster_id
  engine               = var.engine
  engine_version       = var.engine_version
  node_type            = var.node_type
  num_cache_nodes      = 1
  parameter_group_name = var.parameter_group_name
  port                 = var.port
  subnet_group_name    = var.subnet_group_name
  security_group_ids   = var.security_group_ids

  tags = {
    Name = "${var.project_name}-redis-cluster"
  }
}