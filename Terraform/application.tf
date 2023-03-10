module "application-server" {
  source = "./application-server"

  ami-id = "ami-0742b4e673072066f" # AMI for an Amazon Linux instance for region: us-east-1

  iam-instance-profile = aws_iam_instance_profile.course-api.id
  key-pair             = aws_key_pair.course-api-key.key_name
  name                 = "Course API"
  device-index         = 0
  network-interface-id = aws_network_interface.course-api.id
  repository-url       = aws_ecr_repository.course-api.repository_url
}