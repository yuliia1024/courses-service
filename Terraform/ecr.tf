# Production Repository

resource "aws_ecr_repository" "course-api" {
  name = "course-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "Elastic Container Registry to store Docker Artifacts"
  }
}

# Staging Repository

resource "aws_ecr_repository" "course-api-staging" {
  name = "course-api-staging"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "Elastic Container Registry to store Docker Artifacts"
  }
}

# Test Repository

resource "aws_ecr_repository" "course-api-test" {
  name = "course-api-test"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "Elastic Container Registry to store Docker Artifacts"
  }
}