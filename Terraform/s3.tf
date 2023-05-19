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

# To upload all the config files in the folder jenkins-config

resource "aws_s3_bucket_object" "jenkins-config" {
  bucket = aws_s3_bucket.jenkins-config.id
  for_each = fileset("jenkins-config/", "*")
  key = each.value
  source = "jenkins-config/${each.value}"
  etag = filemd5("jenkins-config/${each.value}")
}