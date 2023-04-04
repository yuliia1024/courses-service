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

script{
  // Set environment variables
  GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
  REPOSITORY = sh (script: "cat \$HOME/opt/repository_url", returnStdout: true)
  REPOSITORY_TEST = sh (script: "cat \$HOME/opt/repository_test_url", returnStdout: true)
  REPOSITORY_STAGING = sh (script: "cat \$HOME/opt/repository_staging_url", returnStdout: true)
  INSTANCE_ID = sh (script: "cat \$HOME/opt/instance_id", returnStdout: true)
  S3_LOGS = sh (script: "cat \$HOME/opt/bucket_name", returnStdout: true)
  DATE_NOW = sh (script: "date +%Y%m%d", returnStdout: true)
}

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
          sh """
          echo "Hello World"
          """
        }
      }
    }
    stage("Run Unit Tests") {
      steps {
        echo 'Run unit tests in the docker image'
        script {
          sh """
          echo "Hello World"
          """
        }
      }
    }
    stage("Run Integration Tests") {
      steps {
        echo 'Run Integration tests in the docker image'
        script {
          sh """
          echo "Hello World"
          """
        }
      }
    }
    stage("Build Staging Image") {
      steps {
        echo 'Build the staging image for more tests'
        script {
          sh """
          echo "Hello World"
          """
        }
      }
    }
    stage("Run Load Balancing tests / Security Checks") {
      steps {
        echo 'Run load balancing tests and security checks'
        script {
          sh """
          echo "Hello World"
          """
        }
      }
    }
    stage("Deploy to Fixed Server") {
      steps {
        echo 'Deploy release to production'
        script {
          sh """
          echo "Hello World"
          """
        }
      }
    }
    stage("Clean Up") {
      steps {
        echo 'Clean up local docker images'
        script {
          sh """
          echo "Hello World"
          """
        }
      }
    }
  }
}