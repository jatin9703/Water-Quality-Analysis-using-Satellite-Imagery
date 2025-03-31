import json
import requests
import unittest


class TestAddFunction(unittest.TestCase):
    url = "http://127.0.0.1:5000/api/recieve"
    coords = [
                [73.6472229107984, 20.04490099327118],
                [73.6527160748609, 20.041514436506176],
                [73.65752259341559, 20.042159500567656],
                [73.6607841595777, 20.041191903481952],
                [73.66129914370856, 20.03667637160396],
                [73.65305939761481, 20.027967479339043],
                [73.65300573250386, 20.021102740429498],
                [73.64768422981831, 20.01255428151247],
                [73.64905752083394, 20.008844428372775],
                [73.65231908699604, 20.01078001483826],
                [73.65369237801167, 20.013844644706623],
                [73.65712560555073, 20.014489822334376],
                [73.66519120431497, 20.019423229180692],
                [73.66922524667336, 20.022648976427895],
                [73.6764350245054, 20.023132832807132],
                [73.683387310272, 20.024342467240423],
                [73.67926743722512, 20.03135816339951],
                [73.67853579299168, 20.048224949712584],
                [73.67536005751805, 20.051450105693807],
                [73.6714976765366, 20.052175756658514],
                [73.67175516860203, 20.04943439096976],
                [73.67048532230156, 20.04752007984135],
                [73.6608937428643, 20.051027449565517],
                [73.65874797565239, 20.049676919925574],
                [73.64628353447387, 20.047914482726647]
            ]

    def test_TEMP(self):
        data = {
            "coordinates": self.coords,
            "startDate": "2000-01-01",
            "endDate": "2025-02-20",
            "waterBodyName": "Gangapur Dam",
            "waterParameter": ["TEMP"]
        }

        headers = {"Content-Type": "application/json"}
        response = requests.post(self.url, data=json.dumps(data), headers=headers)

        if response.status_code == 200:
            print("Request was successful!")
            print("Response:", response.json())
        else:
            print("Request failed. Status code:", response.status_code)
            print("Response:", response.text)
        
        self.assertEqual(response.status_code, 200)
    

    def test_PH(self):
        data = {
            "coordinates": self.coords,
            "startDate": "2000-01-01",
            "endDate": "2025-02-20",
            "waterBodyName": "Gangapur Dam",
            "waterParameter": ["PH"]
        }

        headers = {"Content-Type": "application/json"}
        response = requests.post(self.url, data=json.dumps(data), headers=headers)

        if response.status_code == 200:
            print("Request was successful!")
            print("Response:", response.json())
        else:
            print("Request failed. Status code:", response.status_code)
            print("Response:", response.text)
        
        self.assertEqual(response.status_code, 200)
    
    def test_BOD(self):
        data = {
            "coordinates": self.coords,
            "startDate": "2017-01-01",
            "endDate": "2025-02-23",
            "waterBodyName": "Gangapur Dam",
            "waterParameter": ["BOD"]
        }

        headers = {"Content-Type": "application/json"}
        response = requests.post(self.url, data=json.dumps(data), headers=headers)

        if response.status_code == 200:
            print("Request was successful!")
            print("Response:", response.json())
        else:
            print("Request failed. Status code:", response.status_code)
            print("Response:", response.text)
        
        self.assertEqual(response.status_code, 200)
    

    def test_DO(self):
        data = {
            "coordinates": self.coords,
            "startDate": "2017-01-01",
            "endDate": "2025-02-23",
            "waterBodyName": "Gangapur Dam",
            "waterParameter": ["DO"]
        }

        headers = {"Content-Type": "application/json"}
        response = requests.post(self.url, data=json.dumps(data), headers=headers)

        if response.status_code == 200:
            print("Request was successful!")
            print("Response:", response.json())
        else:
            print("Request failed. Status code:", response.status_code)
            print("Response:", response.text)
        
        self.assertEqual(response.status_code, 200)
    

    def test_report(self):
        data = {
            "coordinates": self.coords,
            "startDate": "2024-11-01",
            "endDate": "2025-01-01",
            "waterBodyName": "Gangapur Dam",
            "waterParameter": ["TEMP", "PH"],
            "generateReport": "true",
            "saveToCsv": "true"
        }

        headers = {"Content-Type": "application/json"}
        response = requests.post(self.url, data=json.dumps(data), headers=headers)

        if response.status_code == 200:
            print("Request was successful!")
            print("Response:", response.json())
        else:
            print("Request failed. Status code:", response.status_code)
            print("Response:", response.text)
        
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()