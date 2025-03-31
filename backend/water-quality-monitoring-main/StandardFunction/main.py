import os
import ee
import geemap
from datetime import datetime, timedelta
from parameters import TEMP, NT, NDCI, BOD, DO, PH, DOM, SM, FC

def main_runner(parameter, coordinates, start_date=None, end_date=None, name= None):
    key_path = os.path.join(os.path.dirname(__file__),'jatin-369-701f5688caff.json')
    service_account = 'jatin-369@jatin-369.iam.gserviceaccount.com'
    credentials = ee.ServiceAccountCredentials(service_account, key_path)
    ee.Initialize(credentials)
    geometry = ee.Geometry.Polygon(coordinates)

    if parameter == "TEMP":
        return TEMP(geometry, start_date, end_date, name)
    elif parameter == "NT":
        return NT(geometry, start_date, end_date, name)
    elif parameter == "NDCI":
        return NDCI(geometry, start_date, end_date, name)
    elif parameter == "BOD":
        return BOD(geometry, start_date, end_date, name)
    elif parameter == "DO":
        return DO(geometry, start_date, end_date, name)
    elif parameter == "DOM":
        return DOM(geometry, start_date, end_date, name)
    elif parameter == "PH":
        return PH(geometry, start_date, end_date, name)
    elif parameter == "SM":
        return SM(geometry, start_date, end_date, name)
    elif parameter == "FC":
        return FC(geometry, start_date, end_date, name)
    else:
        print('Invalid response')