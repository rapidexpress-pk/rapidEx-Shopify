pipeline {
  agent any

  environment {
    IMAGE_NAME = "rapidex-shopify"
    DEPLOY_DIR = "/deployment"
    DEPLOY_ENV = "${DEPLOY_DIR}/deploy.env"
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Build Image") {
      steps {
        script {
          env.SHA = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          sh "docker build -t ${IMAGE_NAME}:${env.SHA} ."
        }
      }
    }

    stage("Update deploy.env") {
      steps {
        sh """
          sed -i 's/^SHOPIFY_TAG=.*/SHOPIFY_TAG=${env.SHA}/' ${DEPLOY_ENV} \
          || echo "SHOPIFY_TAG=${env.SHA}" >> ${DEPLOY_ENV}
        """
      }
    }

    stage("Deploy") {
      steps {
        dir("${DEPLOY_DIR}") {
          sh """
            docker compose --env-file deploy.env -f docker-compose.lb.yml up -d --force-recreate shopify
          """
        }
      }
    }

    stage("Cleanup old images") {
      steps {
        sh 'docker image prune -af --filter "until=168h"'
      }
    }
  }
}
