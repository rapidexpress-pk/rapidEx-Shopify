pipeline {
  agent any

  parameters {
    string(name: "DEPLOY_HOST", defaultValue: "", description: "VPS hostname or IP for the Shopify app deploy")
    string(name: "DEPLOY_USER", defaultValue: "", description: "SSH user on the VPS")
  }

  environment {
    IMAGE_NAME = "rapidex-shopify"
    DEPLOY_DIR = "/var/www/rapidexpress"
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

    stage("Validate Deploy Target") {
      steps {
        sh '''
          if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ]; then
            echo "Set DEPLOY_HOST and DEPLOY_USER when starting the Jenkins job."
            exit 1
          fi
        '''
      }
    }

    stage("Update deploy.env") {
      steps {
        sh """
          ssh ${DEPLOY_USER}@${DEPLOY_HOST} "if [ -f ${DEPLOY_DIR}/deploy.env ]; then sed -i 's/^SHOPIFY_TAG=.*/SHOPIFY_TAG=${env.SHA}/' ${DEPLOY_DIR}/deploy.env; else echo 'SHOPIFY_TAG=${env.SHA}' > ${DEPLOY_DIR}/deploy.env; fi"
        """
      }
    }

    stage("Deploy") {
      steps {
        sh """
          ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_DIR} && docker compose --env-file deploy.env -f docker-compose.app.yml up -d --force-recreate shopify"
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
