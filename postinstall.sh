#! /bin/bash

if [ ! -f .env ]; then
    cat .envTemplate > .env
fi