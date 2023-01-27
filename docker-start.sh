#!/bin/bash

help_list() {
  echo "[USAGE] :
  ${0##*/} [-h] [OPTIONS]

[OPTIONS] :
  up      : Do docker-compose up -d (Turn up every containers)(-d to execute in background)
  down    : Do docker-compose down (Turn down every containers)
  serv    : Start server container in background
  web     : Start web_client container in background
  mobile  : Start mobile_client container in background
  db      : Start apollo container in background
  "

}

parse_options() {
  case $@ in

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


    *)
      echo "Unknown option: ${opt} Run ${0##*/} -h for help.">&2
      exit 1
  esac
}

all_up() {
  sudo docker-compose up --build -d
}

all_down() {
  sudo docker-compose down
}

server_up() {
  sudo docker-compose up -d server
}

client_web_up() {
  sudo docker-compose up -d client_web
}

client_mobile_up() {
  sudo docker-compose up -d client_mobile
}

apollo_up() {
  sudo docker-compose up -d apollo
}

parse_options "$@"