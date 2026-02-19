import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Get the configured URL from env
configured_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/api/generate")

# Determine Base URL and Generate URL
if "/api/generate" in configured_url:
    base_url = configured_url.replace("/api/generate", "")
    generate_url = configured_url
else:
    base_url = configured_url
    generate_url = f"{base_url.rstrip('/')}/api/generate"

tags_url = f"{base_url}/api/tags"

print(f"Configured URL: {configured_url}")
print(f"Derived Base URL: {base_url}")
print(f"Testing Tags URL: {tags_url}")

try:
    # 1. Check if service is up by listing models
    print(f"Checking {tags_url}...")
    tags_response = requests.get(tags_url, timeout=10)
    
    if tags_response.status_code == 200:
        print("SUCCESS: Service is reachable.")
        models_data = tags_response.json()
        models = models_data.get('models', [])
        model_names = [m['name'] for m in models]
        print(f"Available models: {model_names}")
        
        if not model_names:
            print("WARNING: No models found! You need to pull a model (e.g., 'ollama pull llama3').")
            exit(1)

        target_model = "llama3"
        # Check for various forms of the model name
        found_model = None
        for m in model_names:
            if target_model in m:
                found_model = m
                break
        
        if not found_model:
             print(f"WARNING: Model '{target_model}' not found. Using '{models[0]['name']}' instead.")
             found_model = models[0]['name']
        
        # 2. Test Generation
        print(f"\nTesting generation with model '{found_model}'...")
        payload = {
            "model": found_model,
            "prompt": "Hi, just say 'Working'",
            "stream": False
        }
        gen_response = requests.post(generate_url, json=payload, timeout=60)
        
        if gen_response.status_code == 200:
            print("SUCCESS: Generation worked!")
            print(f"Response: {gen_response.json().get('response')}")
        else:
            print(f"FAILURE: Generation failed with status {gen_response.status_code}")
            print(gen_response.text)
            
    else:
        print(f"FAILURE: Service reachable but returned status {tags_response.status_code}")

except requests.exceptions.ConnectionError:
    print("\nFAILURE: Could not connect to Ollama. Connection refused.")
    print("Please ensure Ollama is running ('ollama serve').")
except requests.exceptions.ReadTimeout:
    print("\nFAILURE: Connection timed out. Ollama might be overloaded or loading a model.")
except Exception as e:
    print(f"\nERROR: {e}")
