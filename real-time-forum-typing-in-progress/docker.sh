#!/bin/bash

IMAGE_NAME="mon_application_forum_go"

docker image build -f Dockerfile -t "$IMAGE_NAME" .

if [ $? -eq 0 ]; then
  docker container run -it -p 8888:8888 --detach --name "$IMAGE_NAME"_container "$IMAGE_NAME"
  
  if [ $? -eq 0 ]; then
    echo "Docker container for $IMAGE_NAME started successfully."
  else
    echo "Error starting the Docker container."
  fi
else
  echo "Error building the Docker image."
fi
