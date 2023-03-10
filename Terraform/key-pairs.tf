# SSH key - Course API

resource "aws_key_pair" "course-api-key" {
  key_name   = "course-api"
  public_key = file("./course_api.pem")
}

# SSH key - Jenkins

resource "aws_key_pair" "jenkins-key" {
  key_name   = "jenkins"
  public_key = file("./jenkins.pem")
}