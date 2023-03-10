module "redis" {
  source = "./ec-redis"

  project_name         = "course-api-redis-cluster"
  cluster_id           = "course-api-redis-cluster"
  engine               = "redis"
  engine_version       = "5.0.6"
  node_type            = "cache.t2.micro"
  parameter_group_name = "default.redis5.0"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.subnet_group-redis.name
  security_group_ids   = [aws_security_group.allow-redis-traffic.id]
}
