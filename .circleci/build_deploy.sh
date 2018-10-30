#!/usr/bin/env bash
ROOT_DIR=$(pwd)

source $ROOT_DIR/.circleci/utils.sh

checkoutDeployScriptRepo(){
    require DEPLOY_SCRIPTS_REPO $DEPLOY_SCRIPTS_REPO
    info "Cloning $DEPLOY_SCRIPTS_REPO"
    git clone -b $CLONE_BRANCH $DEPLOY_SCRIPTS_REPO $HOME/travela-deploy
    mv $HOME/travela-deploy/deploy $ROOT_DIR/deploy
    source $ROOT_DIR/deploy/template.sh
    rm -rf $HOME/travela-deploy
}

# checkout
buildTagAndPushDockerImage() {
    require 'DOCKER_REGISTRY' $DOCKER_REGISTRY
    require 'PROJECT_ID' $PROJECT_ID
    require 'IMAGE_TAG' $IMAGE_TAG
    require 'SERVICE_KEY_PATH' $SERVICE_KEY_PATH

    # gcr.io/apprenticeship-projects/travela-frontend
    IMAGE_NAME="$DOCKER_REGISTRY/$PROJECT_ID/$PROJECT_NAME"
    TAGGED_IMAGE=$IMAGE_NAME:$IMAGE_TAG
    DOCKER_USERNAME=${DOCKER_USERNAME:-_json_key}

    info "Build docker image for travela application"
    docker build -t $IMAGE_NAME -f docker/Dockerfile .

    info "Tagging built docker image as $TAGGED_IMAGE"
    docker tag $IMAGE_NAME $TAGGED_IMAGE
    is_success "Image successfully tagged $TAGGED_IMAGE"

    info "Login to $DOCKER_REGISTRY container registry"
    is_success_or_fail $(docker login -u  $DOCKER_USERNAME --password-stdin https://${DOCKER_REGISTRY} < $SERVICE_KEY_PATH)

    info "Push $TAGGED_IMAGE to $DOCKER_REGISTRY container registry"
    docker push $TAGGED_IMAGE

    info "Logout of docker container registry"
    is_success_or_fail $(docker logout https://${DOCKER_REGISTRY})

}

buildLintAndDeployK8sConfiguration(){
    findTempateFiles 'TEMPLATES'
    findAndReplaceVariables

    info "Linting generated configuration files"
    k8s-lint -f deploy/travela-frontend.config
    is_success "Completed linting successfully"

    info "Initiating deployment for image $TAGGED_IMAGE to $ENVIRONMENT environment"
    k8s-deploy-and-verify -f deploy/travela-frontend.config
    is_success "$TAGGED_IMAGE successfully deployed"
}

slackPayLoad() {
  if [ "$1" == "fail" ]; then
    TEXT=":fire: Travela Frontend deployment failed :fire:"
    STYLE="danger"
    TITLE="Failed to deploy commit"
    COLOR="danger"
  else
    TEXT=":rocket: Travela Frontend has been successfully deployed to ${ENVIRONMENT} environment :rocket:"
    STYLE="primary"
    TITLE="Deployed commit"
    COLOR="good"
  fi

cat <<EOF
{
    "channel":"${NOTIFICATION_CHANNEL}",
    "username": "DeployNotification",
    "text": "${TEXT}",
    "attachments": [
      {
        "title": "${TITLE} >> $(git rev-parse --short HEAD)",
        "title_link": "https://github.com/andela/travel_tool_front/commit/$CIRCLE_SHA1",
        "color": "${COLOR}",
        "actions": [
          {
            "text": "View Commit",
            "type": "button",
            "url": "https://github.com/andela/travel_tool_front/commit/${CIRCLE_SHA1}",
            "style": "${STYLE}"
          },
          {
            "text": "View Build",
            "type": "button",
            "url": "${CIRCLE_BUILD_URL}",
            "style": "${STYLE}"
          },
          {
            "text": "View Workflow",
            "type": "button",
            "url": "https://circleci.com/workflow-run/${CIRCLE_WORKFLOW_ID}",
            "style": "${STYLE}"
          }
        ]
      }
    ]
}
EOF
}

sendSlackDeployNotification() {
  if [ "${CIRCLE_BRANCH}" == "master" ] \
  || [ "${CIRCLE_BRANCH}" == "develop" ]
  then
    require NOTIFICATION_CHANNEL $NOTIFICATION_CHANNEL
    require SLACK_CHANNEL_HOOK $SLACK_CHANNEL_HOOK

    if [ "$1" == "fail" ]; then
      INFO="Sending failure message to slack"
    else
      INFO="Sending success message to slack"
    fi

    info "${INFO}"
    curl -X POST -H 'Content-type: application/json' --data "$(slackPayLoad "${1}")" "${SLACK_CHANNEL_HOOK}"
    is_success "Slack notification has been successfully sent"
  else
    info "Sends notification for master or develop branch only"
  fi
}

main() {
    checkoutDeployScriptRepo
    buildTagAndPushDockerImage
    buildLintAndDeployK8sConfiguration
    sendSlackDeployNotification
    cleanGeneratedYamlFiles
}

$@
