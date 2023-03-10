output "redis_cluster_port" {
  value = aws_elasticache_cluster.redis_cluster.cache_nodes.0.port
}
output "instance-id" {
  value = aws_elasticache_cluster.redis_cluster.id
}