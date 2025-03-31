from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import date
from main import main_runner
from dbconn import fetch, insert_data
from report import generate_report
import cloudinary.uploader
import cloudinary.api


app = Flask(__name__)
CORS(app)

@app.route('/api/receive', methods=['POST'])
def receive_json():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid or missing JSON"}), 400

    # # swap longitude, latitude
    # for coord in data["coordinates"]:
    #     coord[0], coord[1] = coord[1], coord[0]
        
    print(data)

    start_date, end_date = date_formatter_util(
        data['startDate']), date_formatter_util(data['endDate'])

    coordinates = data['coordinates']
    
    name = None
    if "waterBodyName" in data.keys():
        name = str(data["waterBodyName"])
        
    output = {}

    for parameter in data["waterParameter"]:
        current = main_runner(str(parameter), coordinates, start_date, end_date, name)
        if str(parameter) == "PH":
            output["pH"] = current
        else:
            output[str(parameter)] = current

    if "generateReport" in data.keys() and data["generateReport"] == "true":
        data["values"] = output
        print(data)
        generate_report(data)
        directory = r"D:\VS CODE\water-quality-monitoring-main\StandardFunction"
        return send_from_directory(directory, "report.html", as_attachment=True)

    
    if "saveToCsv" in data.keys() and data["saveToCsv"] == "true":
        print("saveToCsv")

    return jsonify(output), 200


def date_formatter_util(s):
    components = s.split('-')
    year, month, day = [int(item) for item in components]
    return str(date(year, month, day))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)