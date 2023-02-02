#!/bin/bash

help_list() {
  echo "[USAGE] :
  ${0##*/} [-h] [OPTIONS]

[OPTIONS] :
  all       : Remove every docker images, containers, volumes...etc
  image     : Remove every docker images
  container : Remove every docker containers
  volume    : Remove every docker volumes
  prune     : Remove every dangling resources
  list      : List active containers on the current machine
  "

}

RESET='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
LIGHTGRAY='\033[0;37m'
DARKGRAY='\033[1;30m'
LIGHTRED='\033[1;31m'
LIGHTGREEN='\033[1;32m'
YELLOW='\033[1;33m'
LIGHTBLUE='\033[1;34m'
LIGHTPURPLE='\033[1;35m'
LIGHTCYAN='\033[1;36m'
WHITE='\033[1;37m'

parse_options() {
  case $@ in

    -h|help)
      help_list
      exit
    ;;

    all)
      remove_all
    ;;

    image)
      remove_images
    ;;

    container)
      remove_containers
    ;;

    prune)
      remove_prune
    ;;

    list)
          list_active_containers
        ;;

    volume)
      remove_volumes
    ;;

    *)
      echo "Unknown option: ${opt} Run ${0##*/} -h for help.">&2
      exit 1
  esac
}

remove_all() {
  echo -e "${RED}[REMOVING]${RESET} Every images, containers and volumes : "
  echo -e "${LIGHTCYAN}[IMAGES]${RESET}" && sudo docker image prune -f
  echo -e "${LIGHTCYAN}[CONTAINERS]${RESET}" && sudo docker container prune -f
  echo -e "${LIGHTCYAN}[DANGLING RESOURCES]${RESET}" && sudo docker system prune -f
  echo -e "${LIGHTCYAN}[VOLUMES]${RESET}" && sudo docker volume prune -f
  echo -e "${LIGHTGREEN}[SUCCESS]${RESET} removing"
}

remove_images() {
  echo -e "${RED}[REMOVING]${RESET} Every images "
  sudo docker image prune -f
  echo -e "${LIGHTGREEN}[SUCCESS]${RESET} removing"
}

remove_containers() {
  echo -e "${RED}[REMOVING]${RESET} Every stopped containers "
  sudo docker container prune -f
  echo -e "${LIGHTGREEN}[SUCCESS]${RESET} removing"
}

remove_prune() {
  echo -e "${RED}[REMOVING]${RESET} Every dangling resources "
  sudo docker system prune -f
  echo -e "${LIGHTGREEN}[SUCCESS]${RESET} removing"
}

remove_volumes() {
  echo -e "${RED}[REMOVING]${RESET} Every unused volumes "
  sudo docker volume prune -f
  echo -e "${LIGHTGREEN}[SUCCESS]${RESET} removing"
}

list_active_containers() {
  echo -e "${LIGHTCYAN}[INFO]${RESET} Every running containers :"
  sudo docker ps
}

parse_options "$@"