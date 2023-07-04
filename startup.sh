#!/bin/sh

podman run \
 --rm \
 -v ~/ca/cacerts/rootCA/private/root.key.pem:/cacerts/rootCA/private/root.key.pem \
 -v ~/ca/cacerts/rootCA/certs/root.cert.pem:/cacerts/rootCA/certs/root.cert.pem \
 -v ~/ca/cacerts/intermediateCA/private/intermediate.key.pem:/cacerts/intermediateCA/private/intermediate.key.pem \
 -v ~/ca/cacerts/intermediateCA/certs/intermediate.cert.pem:/cacerts/intermediateCA/certs/intermediate.cert.pem \
 -e CA_PATH=/cacerts \
 -p 8080:3000 \
 -d \
 certificate-issuer:latest
