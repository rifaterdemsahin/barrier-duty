import os
import json
import logging
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.blob import BlobServiceClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
KEY_VAULT_URL = os.getenv("KEY_VAULT_URL", "https://dp-kv-deliverypilot.vault.azure.net/")
SECRET_NAME = "AZURE-STORAGE-CONNECTION-STRING"
CONTAINER_NAME = "rota"
BLOB_NAME = "rota.json"

def get_storage_connection_string():
    """Fetch the Azure Storage connection string from Azure Key Vault."""
    logger.info(f"Connecting to Key Vault: {KEY_VAULT_URL}")
    credential = DefaultAzureCredential()
    client = SecretClient(vault_url=KEY_VAULT_URL, credential=credential)
    
    try:
        secret = client.get_secret(SECRET_NAME)
        logger.info(f"Successfully retrieved secret: {SECRET_NAME}")
        return secret.value
    except Exception as e:
        logger.error(f"Failed to retrieve secret {SECRET_NAME}: {str(e)}")
        raise

def upload_rota_to_blob(connection_string, json_data):
    """Upload the updated JSON data to Azure Blob Storage."""
    logger.info(f"Connecting to Azure Blob Storage, container: {CONTAINER_NAME}")
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(CONTAINER_NAME)
    
    # Ensure container exists
    if not container_client.exists():
        logger.info(f"Container {CONTAINER_NAME} does not exist. Creating it...")
        container_client.create_container(public_access="blob")
        
    blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=BLOB_NAME)
    
    # Upload data
    json_bytes = json.dumps(json_data, indent=4).encode('utf-8')
    logger.info(f"Uploading {BLOB_NAME} ({len(json_bytes)} bytes)")
    
    blob_client.upload_blob(json_bytes, overwrite=True)
    logger.info("Upload complete.")

def main():
    # Sample updated rota
    sample_rota = [
        {
            "date": "2026-02-17",
            "day": "Monday",
            "time": "Morning",
            "shift": "morning",
            "volunteer1": "John Smith",
            "volunteer2": "Sarah Jones"
        }
    ]
    
    try:
        conn_str = get_storage_connection_string()
        upload_rota_to_blob(conn_str, sample_rota)
        print("✅ Backend successfully connected to Azure Storage using Key Vault credentials.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
