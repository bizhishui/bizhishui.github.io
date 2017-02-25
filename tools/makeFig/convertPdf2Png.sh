#!/bin/bash

if [ $# -eq 1 ]; then
    convert -density 150 $1.pdf -quality 90 $1.png
else
    echo "This script can only accept one parameter"
    exit 1
fi
