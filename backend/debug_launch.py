import sys
import traceback

print("Attempting to import main...")
try:
    from main import app
    print("Successfully imported app.")
except Exception:
    print("Failed to import app:")
    traceback.print_exc()
