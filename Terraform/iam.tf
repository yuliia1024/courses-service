# API

resource "aws_iam_instance_profile" "course-api" {
  name = "course-api"
  role = aws_iam_role.course-api.name
}

resource "aws_iam_role" "course-api" {
  name = "course-api"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}
# Jenkins

resource "aws_iam_instance_profile" "jenkins" {
  name = "jenkins"
  role = aws_iam_role.jenkins.name
}

resource "aws_iam_role" "jenkins" {
  name = "jenkins"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}