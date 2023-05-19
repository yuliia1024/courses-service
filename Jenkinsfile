def testImage
def stagingImage
def productionImage
def REPOSITORY
def REPOSITORY_TEST
def RESPOSITORY_STAGING
def GIT_COMMIT_HASH
def INSTANCE_ID
def ACCOUNT_REGISTRY_PREFIX
def S3_LOGS
def DATE_NOW
def CREDENTIAL_ID
def EC2_INSTANCE

pipeline {
  agent any
  stages {
    stage("Set Up") {
      steps {
        echo "Logging into the private AWS Elastic Container Registry"
        script {
          // Set environment variables
          GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
          REPOSITORY = sh (script: "cat \$HOME/opt/repository_url", returnStdout: true)
          REPOSITORY_TEST = sh (script: "cat \$HOME/opt/repository_test_url", returnStdout: true)
          REPOSITORY_STAGING = sh (script: "cat \$HOME/opt/repository_staging_url", returnStdout: true)
          INSTANCE_ID = sh (script: "cat \$HOME/opt/instance_id", returnStdout: true)
          S3_LOGS = sh (script: "cat \$HOME/opt/bucket_name", returnStdout: true)
          DATE_NOW = sh (script: "date +%Y%m%d", returnStdout: true)
          EC2_INSTANCE = sh (script: "cat \$HOME/opt/ec2-instance-ip-address", returnStdout: true)
          CREDENTIAL_ID = sh (script: "cat \$HOME/opt/credential-id", returnStdout: true)

          REPOSITORY = REPOSITORY.trim()
          REPOSITORY_TEST = REPOSITORY_TEST.trim()
          REPOSITORY_STAGING = REPOSITORY_STAGING.trim()
          S3_LOGS = S3_LOGS.trim()
          DATE_NOW = DATE_NOW.trim()

          ACCOUNT_REGISTRY_PREFIX = (REPOSITORY.split("/"))[0]

          // Log into ECR
          sh """
          /bin/sh -e -c 'echo \$(aws ecr get-login-password --region us-east-1)  | docker login -u AWS --password-stdin $ACCOUNT_REGISTRY_PREFIX'
          """
        }
      }
    }
    stage("Build Test Image") {
      steps {
        echo 'Start building the project docker image for tests'
        script {
          testImage = docker.build("$REPOSITORY_TEST:$GIT_COMMIT_HASH", "-f ./Dockerfile .")
          testImage.push()
        }
      }
    }
    stage("Build Production Image") {
      steps {
        echo 'Start building the project docker image for production'
        script {
          productionImage = docker.build("$REPOSITORY:release")
          productionImage.push()
        }
      }
    }
    stage("Deploy to Fixed Server") {
//       environment {
//           rds_hostname   = '$(aws ssm get-parameter --name /dev/database/endpoint --query "Parameter.Value" --with-decryption --output text)'
//           rds_username   = '$(aws ssm get-parameter --name /dev/database/username --query "Parameter.Value" --with-decryption --output text)'
//           rds_password   = '$(aws ssm get-parameter --name /dev/database/password --query "Parameter.Value" --with-decryption --output text)'
//           rds_port       = 3306
//
//           redis_hostname = '$(aws ssm get-parameter --name /dev/redis/endpoint --query "Parameter.Value" --with-decryption --output text)'
//           redis_port = 6379
//
//       }
      steps {
        echo 'Deploy release to production'
        script {
          sshagent(credentials: ['$CREDENTIAL_ID']) {
            sh """
            ssh -o StrictHostKeyChecking=no $EC2_INSTANCE << 'ENDSSH'
              # Pull the latest ECR image
              sudo docker pull \${repository_url}:release

              sudo docker stop \$(docker ps -a -q)
              sudo docker rm \$(docker ps -a -q)

              # Run the new container
              sudo docker run -d -p 80:8000 \${repository_url}:release
            ENDSSH
            """
          }
        }
      }
    }
    stage("Clean Up") {
      steps {
        echo 'Clean up local docker images'
        script {
          sh """
          # Change the :latest with the current ones
          docker tag $REPOSITORY:release  $REPOSITORY:latest
          # Remove the image
          docker image rm $REPOSITORY:release
          # Remove dangling images
          docker image prune -f
          """
        }
        echo 'Clean up config.json file with ECR Docker Credentials'
        script {
          sh """
          rm $HOME/.docker/config.json
          """
        }
      }
    }
  }
}
