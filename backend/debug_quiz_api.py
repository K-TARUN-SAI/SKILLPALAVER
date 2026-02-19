import requests

# Assuming job_id 1 exists or whatever job the user is trying
JOB_ID = 1 
URL = f"http://localhost:8000/api/quiz/{JOB_ID}"

try:
    response = requests.get(URL)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Type of data: {type(data)}")
        print(f"Data content: {data}")
        
        if isinstance(data, list):
            print("Confirmed: Data is a list.")
        elif isinstance(data, dict):
            print("WARNING: Data is a dictionary (Object).")
    else:
        print("Failed to get quiz.")
        print(response.text)

except Exception as e:
    print(f"Error: {e}")
