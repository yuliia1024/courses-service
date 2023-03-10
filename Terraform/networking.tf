# 1. Create a VPC
resource "aws_vpc" "course-api" {
  cidr_block           = "10.0.0.0/16" // completely private 10.0 are fixed
  enable_dns_hostnames = true

  tags = {
    Name = "Course API VPC"
  }
}
# 2. Create a Gateway

resource "aws_internet_gateway" "course-api" {
  vpc_id = aws_vpc.course-api.id
}
# 3. Create a Route Table

resource "aws_route_table" "allow-outgoing-access" {
  vpc_id = aws_vpc.course-api.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.course-api.id
  }

  tags = {
    Name = "Route Table Allowing Outgoing Access"
  }
}
# 4.1 Create Subnet - Jenkins

resource "aws_subnet" "subnet-public-jenkins" {
  cidr_block        = "10.0.1.0/24"
  vpc_id            = aws_vpc.course-api.id
  availability_zone = "us-east-1a"

  tags = {
    Name = "Jenkins Subnet"
  }
}
# 4.2 Create Subnet - Course API

resource "aws_subnet" "subnet-public-api" {
  cidr_block        = "10.0.3.0/24"
  vpc_id            = aws_vpc.course-api.id
  availability_zone = "us-east-1a"

  tags = {
    Name = "Course API Subnet"
  }
}
# 4.3 Create Subnet - Redis

resource "aws_subnet" "subnet-redis" {
  cidr_block        = "10.0.5.0/24"
  vpc_id            = aws_vpc.course-api.id
  availability_zone = "us-east-1a"

  tags = {
    Name = "Redis Subnet"
  }
}
# 4.3.1 Create Subnet Group - Redis

resource "aws_elasticache_subnet_group" "subnet_group-redis" {
  name       = "tf-test-cache-subnet"
  subnet_ids = [aws_subnet.subnet-redis.id]
}
# 5.1 Create a Route Table Association --> associate Jenkins subnet to route table

resource "aws_route_table_association" "jenkins-subnet" {
  subnet_id      = aws_subnet.subnet-public-jenkins.id
  route_table_id = aws_route_table.allow-outgoing-access.id
}
# 5.2 Create a Route Table Association --> associate Course API subnet to route table

resource "aws_route_table_association" "redis-subnet" {
  subnet_id      = aws_subnet.subnet-redis.id
  route_table_id = aws_route_table.allow-outgoing-access.id
}
# 5.3 Create a Route Table Association --> associate Redis subnet to route table

resource "aws_route_table_association" "api-subnet" {
  subnet_id      = aws_subnet.subnet-public-api.id
  route_table_id = aws_route_table.allow-outgoing-access.id
}
# 6.1 Create a Security Group for inbound web traffic

resource "aws_security_group" "allow-web-traffic" {
  name        = "allow-web-traffic"
  description = "Allow HTTP / HTTPS inbound traffic"
  vpc_id      = aws_vpc.course-api.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
# 6.2 Create a Security Group for inbound ssh

resource "aws_security_group" "allow-ssh-traffic" {
  name        = "allow-ssh-traffic"
  description = "Allow SSH inbound traffic"
  vpc_id      = aws_vpc.course-api.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
# 6.3 Create a Security Group for inbound traffic to Jenkins

resource "aws_security_group" "allow-jenkins-traffic" {
  name        = "allow-jenkins-traffic"
  description = "Allow jenkins inbound traffic"
  vpc_id      = aws_vpc.course-api.id

  ingress {
    description = "Jenkins"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
# 6.4 Create a Security Group for inbound security checks

resource "aws_security_group" "allow-staging-traffic" {
  name        = "allow-stagin-traffic"
  description = "Allow Inbound traffic for security checks"
  vpc_id      = aws_vpc.course-api.id

  ingress {
    description = "Staging"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
# 6.5 Create a Security Group for outbound traffic

resource "aws_security_group" "allow-all-outbound" {
  name        = "allow-all-outbound"
  description = "Allow all outbound traffic"
  vpc_id      = aws_vpc.course-api.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
# 6.5 Create a Security Group for outbound traffic
resource "aws_security_group" "allow-redis-traffic" {
  name        = "allow-redis-traffic"
  description = "Security group for the Redis instance"
  vpc_id      = aws_vpc.course-api.id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
# 7.1 Create a Network Interface for Jenkins

resource "aws_network_interface" "jenkins" {
  subnet_id       = aws_subnet.subnet-public-jenkins.id
  private_ips     = ["10.0.1.50"]
  security_groups = [
    aws_security_group.allow-all-outbound.id,
    aws_security_group.allow-ssh-traffic.id,
    aws_security_group.allow-jenkins-traffic.id,
    aws_security_group.allow-staging-traffic.id,
    aws_security_group.allow-redis-traffic.id
  ]
}
# 7.2 Create a Network Interface for Redis

resource "aws_network_interface" "redis" {
  subnet_id       = aws_subnet.subnet-redis.id
  private_ips     = ["10.0.5.50"]
  security_groups = [
    aws_security_group.allow-all-outbound.id,
    aws_security_group.allow-ssh-traffic.id,
    aws_security_group.allow-staging-traffic.id
  ]
}
# 7.3 Create a Network Interface for Course API

resource "aws_network_interface" "course-api" {
  subnet_id       = aws_subnet.subnet-public-api.id
  private_ips     = ["10.0.3.50"]
  security_groups = [
    aws_security_group.allow-all-outbound.id,
    aws_security_group.allow-ssh-traffic.id,
    aws_security_group.allow-web-traffic.id,
    aws_security_group.allow-redis-traffic.id
  ]
}
# 8.1 Assign an Elastic IP to the Network Interface of Jenkins

resource "aws_eip" "jenkins" {
  vpc                       = true
  network_interface         = aws_network_interface.jenkins.id
  associate_with_private_ip = "10.0.1.50"
  depends_on                = [
    aws_internet_gateway.course-api
  ]
}
# 8.3 Assign an Elastic IP to the Network Interface of Redis

resource "aws_eip" "redis" {
  vpc                       = true
  network_interface         = aws_network_interface.redis.id
  associate_with_private_ip = "10.0.5.50"
  depends_on                = [
    aws_internet_gateway.course-api
  ]
}
# 8.2 Assign an Elastic IP to the Network Interface of Course API

resource "aws_eip" "course-api" {
  vpc                       = true
  network_interface         = aws_network_interface.course-api.id
  associate_with_private_ip = "10.0.3.50"
  depends_on                = [
    aws_internet_gateway.course-api
  ]
}