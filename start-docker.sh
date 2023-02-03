#!/bin/bash

help_list() {
  echo "[USAGE] :
  ${0##*/} [-h] [OPTIONS]

[OPTIONS] :
  export_env : export passed parameter .env (default $PWD/.env) file to environment variable (usefull for developping)
  up      : Do docker-compose up  (Turn up every containers)
  down    : Do docker-compose down (Turn down every containers)
  serv    : Start server container
  web     : Start web_client container
  mobile  : Start mobile_client container
  db      : Start apollo container
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
  case ${1} in

    -h|help)
      help_list
      exit
    ;;

    up)
      all_up
    ;;

    down)
      all_down
    ;;

    serv)
      server_up
    ;;

    web)
      client_web_up
    ;;

    mobile)
      client_mobile_up
    ;;

    db)
      apollo_up
    ;;

    export_env)
      export_env ${2}
    ;;

    *)
      echo "Unknown option: ${opt} Run ${0##*/} -h for help.">&2
      exit 1
  esac
}

export_env()
{
  if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}This script must be run as root${RESET}">&2
    exit 1
  fi

  if [ ! -f ${1:-.env} ]; then
    echo -e "[${RED}File $(realpath -s ${1:-.env}) not found${RESET}">&2
    exit 1
  fi
  echo -e "Exporting environment variables from $(realpath -s ${1:-.env}) file..."
  export $(grep -v '^#' $(realpath -s ${1:-.env}))
  echo -e "[${GREEN}+${RESET}] Env variables exported"
  echo -e "[${YELLOW}~${RESET}] Exporting AREA hostnames to /etc/hosts"
  grep "area_database" /etc/hosts 2>&1 > /dev/null
  if [[ $? -eq 1 ]]; then
    echo -e "[${YELLOW}~${RESET}] Adding area_database hostname to /etc/hosts"
    echo "127.0.0.1  area_database" >> /etc/hosts
  fi
  echo -e "[${GREEN}+${RESET}] Successfully exported container ips addresses"
}

all_up() {
  sudo docker-compose up --build
}

all_down() {
  sudo docker-compose down
}

server_up() {
  sudo docker-compose up --build  server
}

client_web_up() {
  sudo docker-compose up --build  client_web
}

client_mobile_up() {
  sudo docker-compose up --build  client_mobile
}

apollo_up() {
  sudo docker-compose up --build apollo
}

parse_options "$@"