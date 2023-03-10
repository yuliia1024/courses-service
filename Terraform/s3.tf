# S3 Bucket storing logs

resource "aws_s3_bucket" "course-api-logs" {
  bucket = "yuliia1024-course-api-logs"
  acl    = "private"
}

# S3 Bucket storing jenkins user data

resource "aws_s3_bucket" "jenkins-config" {
  bucket = "yuliia1024-course-api-config"
  acl    = "private"
}

# S3 Bucket storing api homework data

resource "aws_s3_bucket" "course-homework-prod" {
  bucket = "course-homework-prod"
  acl    = "private"
}