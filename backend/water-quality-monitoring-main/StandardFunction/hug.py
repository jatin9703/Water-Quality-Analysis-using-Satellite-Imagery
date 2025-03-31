import sqlite3
import pandas as pd
import requests

# Replace with your Hugging Face API token
API_TOKEN = "YOUR_HUGGING_FACE_API_TOKEN"

# Hugging Face API endpoint
API_URL = "https://api-inference.huggingface.co/models/gpt2"  # You can replace "gpt2" with another model

# Headers for authentication
headers = {"Authorization": f"Bearer {API_TOKEN}"}

# Function to query the Hugging Face API
def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

# Connect to the database (replace with your database file and table name)
def fetch_data_from_db():
    conn = sqlite3.connect("your_database.db")  # Replace with your database file
    query = """
    SELECT timestamp, parameter1, parameter2, parameter3
    FROM water_body_data
    ORDER BY timestamp;
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

# Convert database data to text
def data_to_text(df):
    text = "Time-series data for water body parameters:\n"
    for index, row in df.iterrows():
        text += (
            f"On {row['timestamp']}, "
            f"Parameter1: {row['parameter1']}, "
            f"Parameter2: {row['parameter2']}, "
            f"Parameter3: {row['parameter3']}\n"
        )
    return text

# Main function
def main():
    # Fetch data from the database
    df = fetch_data_from_db()

    # Convert data to text
    data_text = data_to_text(df)

    # Create a prompt for the AI model
    prompt = f"""
    Analyze the following time-series data for water body parameters and provide insights:
    {data_text}

    Questions:
    1. What are the trends in Parameter1?
    2. What could explain the spike in Parameter2?
    3. Is there any correlation between the parameters?
    """

    # Send the prompt to the Hugging Face API
    try:
        response = query({"inputs": prompt})
        # Print the model's response
        print("AI Insights:")
        print(response[0]["generated_text"])
    except Exception as e:
        print(f"An error occurred: {e}")

# Run the program
if __name__ == "__main__":
    main()