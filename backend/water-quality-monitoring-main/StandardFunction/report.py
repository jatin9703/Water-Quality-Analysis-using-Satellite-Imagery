import json
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
import cloudinary
from google import genai
import cloudinary.uploader
import os

# 📌 Define Parameter Metadata with Safety Limits & Normal Ranges
PARAMETER_INFO = {
    "pH": {"safety_limit": "6.5 - 8.5", "normal_range": "6.8 - 7.5"},
    "TEMP": {"safety_limit": "< 50°C", "normal_range": "0 - 40°C"},
    "Turbidity": {"safety_limit": "< 5 NTU", "normal_range": "0 - 3 NTU"},
    "DO": {"safety_limit": "> 5 mg/L", "normal_range": "6 - 8 mg/L"},
    "BOD": {"safety_limit": "< 3 mg/L", "normal_range": "1 - 2 mg/L"},
    "NT": {"safety_limit": "< 10 mg/L", "normal_range": "0 - 5 mg/L"},
    "NDCI": {"safety_limit": "-0.1 to 0.2", "normal_range": "-0.05 to 0.15"},
    "DOM": {"safety_limit": "< 20 mg/L", "normal_range": "5 - 15 mg/L"},
    "SM": {"safety_limit": "< 50 mg/L", "normal_range": "10 - 40 mg/L"},
    "FC": {"safety_limit": "< 200 CFU/100mL", "normal_range": "0 - 100 CFU/100mL"},
}

# ✅ Configure Cloudinary for Image Uploads
cloudinary.config(
    cloud_name="dpqccw47q",
    api_key="424564632187347",
    api_secret="iyKoDH6nvffbLRKdnb99cnzqbog"
)

def send_image(path):
    """Uploads an image to Cloudinary and returns its URL."""
    response = cloudinary.uploader.upload(path)
    return response['secure_url']

def generate_report(data):
    print(data)
    """
    Generates a water quality report dynamically, uploads graphs to Cloudinary, and updates report.html.

    Parameters:
        data (dict): Water quality data with date-wise values for each parameter.

    Outputs:
        Saves an HTML report with updated image URLs.
    """
    summary = {}
    graph_links = {}

    # 📌 Process Each Parameter Dynamically
    for param in data["values"]:  
        values = list(data["values"][param].values())
        avg_value = round(sum(values) / len(values), 2) if values else None

        # Use pre-defined safety limits if available, else set as "Unknown"
        safety_limit = PARAMETER_INFO.get(param, {}).get("safety_limit", "Unknown")
        normal_range = PARAMETER_INFO.get(param, {}).get("normal_range", "Unknown")

        summary[param] = {
            "avg": avg_value,
            "safety_limit": safety_limit,
            "normal_range": normal_range
        }

    # 📊 Generate & Upload Graphs for Each Parameter
    image_dir = "D:/VS CODE/water-quality-monitoring-main/StandardFunction"
    os.makedirs(image_dir, exist_ok=True)  # Ensure directory exists

    for param, values in data["values"].items():
        dates = list(values.keys())
        readings = list(values.values())

        # Create graph
        plt.figure()
        plt.plot(dates, readings, marker="o", linestyle="-", label=param)
        plt.xlabel("Date")
        plt.ylabel(param)
        plt.title(f"{param} Trends Over Time")
        plt.legend()
        plt.xticks(rotation=45)
        plt.tight_layout()

        # Save graph locally
        graph_path = os.path.join(image_dir, f"{param}.png")
        plt.savefig(graph_path)
        plt.close()

        # 🔄 Upload to Cloudinary and store URL
        graph_links[param] = send_image(graph_path)
    

    # 🤖 AI-based Recommendations
    recommendations = []
    for param in data["waterParameter"]:
        client = genai.Client(api_key="AIzaSyCAkeM3tRY8xVON9hU7pvwrtCLzd128iMY")

        prompt = f"""
            Analyze the following time-series data for water body parameters and provide insight in one line,i want very short analysis for making water quality report so and remember no **  dont say anything except the insight:
            data: {data}
            """

        response = client.models.generate_content(model="gemini-2.0-flash",contents= prompt,)
        print(response.text)
        recommendations.append(response.text)
    
    
    
    client = genai.Client(api_key="AIzaSyCAkeM3tRY8xVON9hU7pvwrtCLzd128iMY")

    prompt2 = f"""
            Analyze the following time-series data for water body parameters and provide conclusion of one paragraph of 100ish words about the water quality and remember no **  dont say anything except the conclusion:
            data: {data}
            """

    conclusion = client.models.generate_content(model="gemini-2.0-flash",contents= prompt2,).text


    # 📜 Load and Render HTML Template
    script_dir = os.path.dirname(os.path.abspath(__file__))  
    env = Environment(loader=FileSystemLoader(script_dir))  
    template = env.get_template("report_template.html")  

    output_html = template.render(
        generated_date=datetime.today().strftime("%Y-%m-%d"),
        startDate=data["startDate"],
        endDate=data["endDate"],
        location=data["waterBodyName"],
        summary=summary,  # Now dynamic for all parameters
        values=data["values"],
        graph_links=graph_links,  # Updated Cloudinary image links
        recommendations=recommendations,
        conclusion=conclusion
    )

    # 📝 Save the Report
    output_path = os.path.join(image_dir, "report.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(output_html)

    print(f"✅ Report saved at: {output_path}")

if __name__ == "__main__":
    # 🌊 Sample Data
    sample_data = {
        "startDate": "2024-01-01",
        "endDate": "2024-02-01",
        "waterBodyName": "Lake Michigan",
        "values": {
            "pH": {"2024-01-05": 7.2, "2024-01-10": 7.0, "2024-01-15": 6.8},
            "Turbidity": {"2024-01-05": 3.5, "2024-01-10": 4.1, "2024-01-15": 3.8},
            "TEMP": {"2024-01-05": 15, "2024-01-10": 18, "2024-01-15": 12},
            "NDCI": {"2024-01-05": -0.05, "2024-01-10": 0.1, "2024-01-15": 0.15},
            "BOD": {"2024-01-05": 2.1, "2024-01-10": 2.5, "2024-01-15": 1.9}
        }
    }

    generate_report(sample_data)
