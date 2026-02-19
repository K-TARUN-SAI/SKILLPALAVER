from database import engine
from sqlalchemy import inspect

inspector = inspect(engine)
columns = inspector.get_columns('jobs')
print("Columns in 'jobs' table:")
for column in columns:
    print(f"- {column['name']}")
