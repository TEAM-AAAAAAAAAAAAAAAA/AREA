#!/bin/bash

help_list() {
  echo "Usage :
  ${0##*/} [-h] [options]
Options :
  up :
    Do docker-compose up -d (Turn up every containers)(-d to execute in background)
  down :
    Do docker-compose down (Turn down every containers)
  apollo :
    Start apollo container in background
  web_client :
    Start web_client container in background
  mobile_client :
    Start mobile_client container in background
  server :
    Start server container in background
  "

}

parse_options() {
  case $@ in

    -h|help)
      help_list
      exit
    ;;

    up)
      turn_up
    ;;

    down)
      turn_down
    ;;

    *)
      echo "Unknown option: ${opt} Run ${0##*/} -h for help.">&2
      exit 1
  esac
}

turn_up() {
  docker-compose up --build -d
  docker-compose exec php bash
}

turn_down() {
  docker-compose down
}

parse_options "$@"