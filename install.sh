#!/bin/sh

sudo npm install -g gulp
sudo npm install -g bower

npm install
bower install

gulp production

echo "Install Done !"
