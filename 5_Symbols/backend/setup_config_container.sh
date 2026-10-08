#!/bin/bash
# setup_config_container.sh
# Creates the config container and uploads JSONs to Azure Blob Storage

RESOURCE_GROUP="rg-barrierduty"
ACCOUNT_NAME="dpstoragebarrierduty"
CONTAINER_NAME="config"

echo "Creating container: $CONTAINER_NAME..."
az storage container create \
    --name $CONTAINER_NAME \
    --account-name $ACCOUNT_NAME \
    --public-access blob \
    --auth-mode login

echo "Uploading navigation_config.json..."
az storage blob upload \
    --account-name $ACCOUNT_NAME \
    --container-name $CONTAINER_NAME \
    --file navigation_config.json \
    --name navigation_config.json \
    --auth-mode login \
    --overwrite

echo "Uploading carousel_config.json..."
az storage blob upload \
    --account-name $ACCOUNT_NAME \
    --container-name $CONTAINER_NAME \
    --file 3_Simulation/carousel_config.json \
    --name carousel_config.json \
    --auth-mode login \
    --overwrite

echo "Done! Configurations are now hosted on Azure."
