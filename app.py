from flask import Flask, request, jsonify, send_from_directory
import os
import json
import logging
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.blob import BlobServiceClient

app = Flask(__name__, static_folder='.', static_url_path='')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

KEY_VAULT_URL = os.getenv("KEY_VAULT_URL", "https://dp-kv-deliverypilot.vault.azure.net/")
SECRET_NAME = "AZURE-STORAGE-CONNECTION-STRING"
CONTAINER_NAME = "rota"

def get_storage_connection_string():
    if os.getenv("USE_LOCAL_STORAGE", "True") == "True":
        return None
    try:
        credential = DefaultAzureCredential()
        client = SecretClient(vault_url=KEY_VAULT_URL, credential=credential)
        secret = client.get_secret(SECRET_NAME)
        return secret.value
    except Exception as e:
        logger.error(f"Error fetching Azure credentials: {e}")
        return None

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/data/<entity>', methods=['GET'])
def get_data(entity):
    if entity not in ['rota', 'volunteers', 'updates']:
        return jsonify({"error": "Invalid entity"}), 400
    
    file_name = f"{entity}.json"
    
    conn_str = get_storage_connection_string()
    if conn_str:
        try:
            blob_service_client = BlobServiceClient.from_connection_string(conn_str)
            container_client = blob_service_client.get_container_client(CONTAINER_NAME)
            blob_client = container_client.get_blob_client(file_name)
            if blob_client.exists():
                data = blob_client.download_blob().readall()
                return jsonify(json.loads(data))
        except Exception as e:
            logger.warning(f"Failed to fetch {file_name} from Azure: {e}")

    local_path = os.path.join('5_Symbols', file_name)
    if os.path.exists(local_path):
        with open(local_path, 'r') as f:
            return jsonify(json.load(f))
            
    return jsonify([])

@app.route('/api/data/<entity>', methods=['POST'])
def save_data(entity):
    if entity not in ['rota', 'volunteers', 'updates']:
        return jsonify({"error": "Invalid entity"}), 400
        
    data = request.json
    file_name = f"{entity}.json"
    
    conn_str = get_storage_connection_string()
    if conn_str:
        try:
            blob_service_client = BlobServiceClient.from_connection_string(conn_str)
            container_client = blob_service_client.get_container_client(CONTAINER_NAME)
            if not container_client.exists():
                container_client.create_container(public_access="blob")
            blob_client = container_client.get_blob_client(file_name)
            blob_client.upload_blob(json.dumps(data, indent=4).encode('utf-8'), overwrite=True)
            return jsonify({"status": "success", "message": f"Saved {file_name} to Azure"})
        except Exception as e:
            logger.warning(f"Failed to save {file_name} to Azure: {e}")

    local_path = os.path.join('5_Symbols', file_name)
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    with open(local_path, 'w') as f:
        json.dump(data, f, indent=4)
        
    return jsonify({"status": "success", "message": f"Saved {file_name} locally"})

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
