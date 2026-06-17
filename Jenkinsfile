pipeline {
  agent any

  environment {
    IMAGE_NAME = "rapidex-shopify"
    DEPLOY_HOST = "YOUR_VPS_HOST"
    DEPLOY_USER = "YOUR_VPS_USER"
    DEPLOY_DIR = "/var/www/rapidexpress"
    DEPLOY_TARGET = "${DEPLOY_USER}@${DEPLOY_HOST}"
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
          ssh ${DEPLOY_TARGET} "if [ -f ${DEPLOY_DIR}/deploy.env ]; then sed -i 's/^SHOPIFY_TAG=.*/SHOPIFY_TAG=${env.SHA}/' ${DEPLOY_DIR}/deploy.env; else echo 'SHOPIFY_TAG=${env.SHA}' > ${DEPLOY_DIR}/deploy.env; fi"
        """
      }
    }

    stage("Deploy") {
      steps {
        sh """
          ssh ${DEPLOY_TARGET} "cd ${DEPLOY_DIR} && docker compose --env-file shopify.env -f docker-compose.app.yml up -d --force-recreate shopify"
        """
      }
    }

    stage("Cleanup old images") {
      steps {
        sh 'docker image prune -af --filter "until=168h"'
      }
    }
  }
}
