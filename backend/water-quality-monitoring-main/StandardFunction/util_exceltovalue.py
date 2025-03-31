import pandas as pd

def excel_to_dict(file_path):
    """Convert Excel file to dictionary format: {'PARAM': {'YYYY-MM-DD': value}}"""
    
    # Read Excel
    df = pd.read_excel(file_path)
    
    # Ensure 'date' column is in correct format
    df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
    
    # Convert to dictionary
    data_dict = {}
    for col in df.columns:
        if col != 'Date':  # Skip the date column
            data_dict[col] = dict(zip(df['Date'], df[col]))
    
    return data_dict

# 🔹 Example Usage
file_path = "water-quality-monitoring-main\StandardFunction\officialdatagangapurdam.xlsx"  # Change this to your file path
result = excel_to_dict(file_path=file_path)
print(result)
