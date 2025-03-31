import ee 
import asyncio
import geemap 
import datetime 
from datetime import date
import numpy as np
import pandas as pd
from dbconn import insert_data, fetch
import matplotlib.pyplot as plt

DB_Config_LOCAL = {
    "dbname": "waterdb",
    "user": "postgres",
    "password": "1234",
    "host": "localhost",
    "port": "5432"
}

DB_Config_CLOUD = {
    "dbname": "tsdb",
    "user": "tsdbadmin",
    "password": "whksn0qe3ubh121j",
    "host": "e87ogbdxin.ufdzoe10za.tsdb.cloud.timescale.com",
    "port": "30893"
}


# DB_CONFIG = DB_Config_LOCAL
DB_CONFIG = DB_Config_CLOUD

def TEMP(geometry, start_date, end_date, name= None, print_data=True):
    if name:
        cached_data = fetch(DB_CONFIG, name, ["TEMP"], start_date, end_date)
        if cached_data:
            return cleaning(name= "TEMP", data= cached_data["TEMP"])

    landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2").\
        filterDate(start_date,end_date)
    landsat_AOI = landsat.filterBounds(geometry)
        
    def addtemp(image):
        temp = image.select('ST_B.*').multiply(0.00341802).add(149.0).subtract(273.15).rename('temperature')
        return image.addBands(temp)
    with_temp = landsat_AOI.map(addtemp)

    def meantemp(image):
        image = ee.Image(image)
        mean = image.reduceRegion(reducer = ee.Reducer.mean().setOutputs(['temperature']),
                                  geometry = landsat_AOI,
                                  scale = image.projection().nominalScale().getInfo(),
                                  maxPixels = 100000,
                                  bestEffort = True);
        return mean.get('temperature').getInfo()
    Images_temp = with_temp.select('temperature').toList(with_temp.size())
    temp_coll = []
    date_coll=[]
    
    values = {}
    
    for i in range(Images_temp.length().getInfo()):
        image = ee.Image(Images_temp.get(i-1))
        tempe_temp = meantemp(image)
       
        
        ddate = image.get('system:time_start').getInfo()  # Get the timestamp
        date_coll.append(datetime.datetime.fromtimestamp(ddate / 1000).strftime('%Y-%m-%d'))  # Convert to date string
        temp_coll.append(tempe_temp)  # Append temperature value
        values[date_coll[-1]] = tempe_temp
        print(f"Date: {date_coll[-1]}, Temperature: {tempe_temp}")
        
    if name:
        insert_data(DB_CONFIG, name, {"TEMP": values})
    cleaned_data = cleaning(name= "TEMP", data= values)
    d1 = tuple(values.items())

    print(values)
    if print_data:
        for i in range(len(d1)):
            if d1[i][0] in cleaned_data:
                if values[d1[i][0]] == cleaned_data[d1[i][0]]:
                    print(d1[i], "\t", cleaned_data[d1[i][0]], "\tNo Change")
                else:
                    print(d1[i], "\t", cleaned_data[d1[i][0]],
                          "\tCorrected value")
            else:
                print(d1[i], "\t\t\t\tdata removed during cleaning")

    return cleaned_data

    
def NDCI(geometry, start_date, end_date, name= None, print_data=True):
    if name:
        cached_data = fetch(DB_CONFIG, name, ["NDCI"], start_date, end_date)
        if cached_data:
            return cleaning(name= "NDCI", data= cached_data["NDCI"])


    sentinel = ee.ImageCollection("COPERNICUS/S2_SR").\
               filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).\
               filterDate(start_date , end_date)
    
    sentinel_AOI = sentinel.filterBounds(geometry)
    def addNDCI(image):
        ndci = image.normalizedDifference(['B5', 'B4']).rename('NDCI')
        return image.addBands(ndci)

    with_ndci = sentinel_AOI.map(addNDCI)
    def meanNDCI(image):
        image = ee.Image(image)
        mean = image.reduceRegion(reducer = ee.Reducer.mean().setOutputs(['NDCI']),
                                geometry = geometry,
                                scale = image.projection().nominalScale().getInfo(),
                                maxPixels = 100000,
                                bestEffort = True);
        return mean.get('NDCI').getInfo()
    print('starting the loop')
    Images_ndci = with_ndci.select('NDCI').toList(with_ndci.size())
    ndci_coll = []
    date_coll=[]
    
    values = {}
    
    for i in range(Images_ndci.length().getInfo()):
        image = ee.Image(Images_ndci.get(i-1))
        temp_ndci = meanNDCI(image)
        ndci_coll.append(temp_ndci)
        ddate = image.get('system:time_start').getInfo()  # Get the timestamp
        date_coll.append(datetime.datetime.fromtimestamp(ddate / 1000).strftime('%Y-%m-%d'))  # Convert to date string
        print(f"Date: {date_coll[-1]}, Value: {temp_ndci}")
        values[date_coll[-1]] = temp_ndci
        
    if name:
        insert_data(DB_CONFIG, name, {"NDCI": values})
    cleaned_data = cleaning(name= "NDCI", data= values)
    d1 = tuple(values.items())

    if print_data:
        for i in range(len(d1)):
            if d1[i][0] in cleaned_data:
                if values[d1[i][0]] == cleaned_data[d1[i][0]]:
                    print(d1[i], "\t", cleaned_data[d1[i][0]], "\tNo Change")
                else:
                    print(d1[i], "\t", cleaned_data[d1[i][0]],
                          "\tCorrected value")
            else:
                print(d1[i], "\t\t\t\tdata removed during cleaning")

    return cleaned_data


def BOD(geometry, start_date, end_date, name= None, print_data=True):
    if name:
        cached_data = fetch(DB_CONFIG, name, ["BOD"], start_date, end_date)
        if cached_data:
            return cleaning(name= "BOD", data= cached_data["BOD"])

    sentinel = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED").\
                    filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).\
                    filterDate(start_date,end_date)
                
    sentinel_AOI = sentinel.filterBounds(geometry)
    def addDO(image):
        do = (ee.Image(2.7091).multiply(image.select('B4').divide(image.select('TCI_R')))
    .add(ee.Image(-1.2889).multiply(image.select('B2').divide(image.select('WVP'))))
    .add(ee.Image(1.7720).multiply(image.select('B3').divide(image.select('WVP'))))
    .add(ee.Image(-23.6213))
    .rename('BOD'))
        return image.addBands(do)
    with_do = sentinel_AOI.map(addDO)
    def meanDO(image):
        image = ee.Image(image)
        mean = image.reduceRegion(reducer = ee.Reducer.mean().setOutputs(['BOD']),
                                  geometry = geometry,
                                  scale = image.projection().nominalScale().getInfo(),
                                  maxPixels = 100000,
                                  bestEffort = True);
        return mean.get('BOD').getInfo()
    Images_do = with_do.select('BOD').toList(with_do.size()) 
    do_coll = []
    date_coll=[]
    
    values = {}
    
    for i in range(Images_do.length().getInfo()):
        image = ee.Image(Images_do.get(i-1))
        temp_do = meanDO(image)
        do_coll.append(temp_do)
        ddate = image.get('system:time_start').getInfo()  # Get the timestamp
        date_coll.append(datetime.datetime.fromtimestamp(ddate / 1000).strftime('%Y-%m-%d'))  # Convert to date string
        print(f"Date: {date_coll[-1]}, Value: {temp_do}")
        values[date_coll[-1]] = temp_do

    if name:
        insert_data(DB_CONFIG, name, {"BOD": values})
    cleaned_data = cleaning(name= "BOD", data= values)
    d1 = tuple(values.items())

    print(values)
    if print_data:
        for i in range(len(d1)):
            if d1[i][0] in cleaned_data:
                if values[d1[i][0]] == cleaned_data[d1[i][0]]:
                    print(d1[i], "\t", cleaned_data[d1[i][0]], "\tNo Change")
                else:
                    print(d1[i], "\t", cleaned_data[d1[i][0]],
                          "\tCorrected value")
            else:
                print(d1[i], "\t\t\t\tdata removed during cleaning")

    return cleaned_data


def DOM(geometry, start_date, end_date, name= None, print_data=True):
    if name:
        cached_data = fetch(DB_CONFIG, name, ["DOM"], start_date, end_date)
        if cached_data:
            return cleaning(name= "DOM", data= cached_data["DOM"])

    sentinel3 = ee.ImageCollection("COPERNICUS/S3/OLCI").\
              filterDate(start_date, end_date)

    sentinel3_AOI = sentinel3.filterBounds(geometry)
    
    def addDM(image):
        rgb = image.select(['Oa08_radiance', 'Oa06_radiance', 'Oa04_radiance'])\
            .multiply(ee.Image([0.00876539, 0.0123538, 0.0115198]))
        dm = rgb.select('Oa08_radiance').divide(rgb.select('Oa04_radiance')).rename('dom')
        return image.addBands(dm)
    with_dm = sentinel3_AOI.map(addDM)
    def meanDM(image):
        image = ee.Image(image)
        mean = image.reduceRegion(reducer = ee.Reducer.mean().setOutputs(['dom']),
                                  geometry = geometry,
                                  scale = image.projection().nominalScale().getInfo(),
                                  maxPixels = 100000,
                                  bestEffort = True);
        return mean.get('dom').getInfo()
    Images_dm = with_dm.select('dom').toList(with_dm.size())
    dm_coll= []
    date_coll=[]
    
    values = {}
    
    for i in range(Images_dm.length().getInfo()):
        image = ee.Image(Images_dm.get(i-1))
        temp_dm = meanDM(image)
        dm_coll.append(temp_dm)
        ddate = image.get('system:time_start').getInfo()  # Get the timestamp
        date_coll.append(datetime.datetime.fromtimestamp(ddate / 1000).strftime('%Y-%m-%d'))  # Convert to date string
        print(f"Date: {date_coll[-1]}, Value: {temp_dm}")   
        values[date_coll[-1]] = temp_dm
    
    if name:
        insert_data(DB_CONFIG, name, {"DOM": values})
    cleaned_data = cleaning(name= "DOM", data= values)
    d1 = tuple(values.items())

    print(values)
    if print_data:
        for i in range(len(d1)):
            if d1[i][0] in cleaned_data:
                if values[d1[i][0]] == cleaned_data[d1[i][0]]:
                    print(d1[i], "\t", cleaned_data[d1[i][0]], "\tNo Change")
                else:
                    print(d1[i], "\t", cleaned_data[d1[i][0]],
                          "\tCorrected value")
            else:
                print(d1[i], "\t\t\t\tdata removed during cleaning")

    return cleaned_data


def SM(geometry, start_date, end_date, name= None, print_data=True):
    if name:
        cached_data = fetch(DB_CONFIG, name, ["SM"], start_date, end_date)
        if cached_data:
            return cleaning(name= "SM", data= cached_data["SM"])

    sentinel3 = ee.ImageCollection("COPERNICUS/S3/OLCI").\
              filterDate(start_date, end_date)

    sentinel3_AOI = sentinel3.filterBounds(geometry)
    def addSM(image):
        rgb = image.select(['Oa08_radiance', 'Oa06_radiance', 'Oa04_radiance'])\
            .multiply(ee.Image([0.00876539, 0.0123538, 0.0115198]))
        suspended_matter = rgb.select('Oa08_radiance').divide(rgb.select('Oa06_radiance')).rename('suspended_matter')
        return image.addBands(suspended_matter)
    with_sm = sentinel3_AOI.map(addSM)
    def meanSM(image):
        image = ee.Image(image)
        mean = image.reduceRegion(reducer = ee.Reducer.mean().setOutputs(['suspended_matter']),
                                  geometry = geometry,
                                  scale = image.projection().nominalScale().getInfo(),
                                  maxPixels = 100000,
                                  bestEffort = True);
        return mean.get('suspended_matter').getInfo()
    Images_sm = with_sm.select('suspended_matter').toList(with_sm.size())
    sm_coll= []
    date_coll=[]
    
    values = {}
    
    for i in range(Images_sm.length().getInfo()):
        image = ee.Image(Images_sm.get(i-1))
        temp_sm = meanSM(image)
        sm_coll.append(temp_sm)
        ddate = image.get('system:time_start').getInfo()  # Get the timestamp
        date_coll.append(datetime.datetime.fromtimestamp(ddate / 1000).strftime('%Y-%m-%d'))  # Convert to date string
        print(f"Date: {date_coll[-1]}, Value: {temp_sm}")
        values[date_coll[-1]] = temp_sm

    if name:
        insert_data(DB_CONFIG, name, {"SM": values})
    cleaned_data = cleaning(name= "SM", data= values)
    d1 = tuple(values.items())

    print(values)
    if print_data:
        for i in range(len(d1)):
            if d1[i][0] in cleaned_data:
                if values[d1[i][0]] == cleaned_data[d1[i][0]]:
                    print(d1[i], "\t", cleaned_data[d1[i][0]], "\tNo Change")
                else:
                    print(d1[i], "\t", cleaned_data[d1[i][0]],
                          "\tCorrected value")
            else:
                print(d1[i], "\t\t\t\tdata removed during cleaning")

    return cleaned_data


def NT(geometry, start_date, end_date, name= None, print_data=True):
    if name:
        cached_data = fetch(DB_CONFIG, name, ["NT"], start_date, end_date)
        if cached_data:
            return cleaning(name= "NT", data= cached_data["NT"])

    sentinel = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED").\
                    filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).\
                    filterDate(start_date,end_date)
                
    sentinel_AOI = sentinel.filterBounds(geometry)
    def addDO(image):

        
        do = (ee.Image(-0.3513).multiply(image.select('B5').divide(image.select('B12')))
    .add(ee.Image(0.4085).multiply(image.select('B3').divide(image.select('B12'))))
    .add(ee.Image(-0.2544).multiply(image.select('B3').divide(image.select('B8A'))))
    .add(ee.Image(0.4962))
    .rename('Nt'))
        return image.addBands(do)
    with_do = sentinel_AOI.map(addDO)
    def meanDO(image):
        image = ee.Image(image)
        mean = image.reduceRegion(reducer = ee.Reducer.mean().setOutputs(['Nt']),
                                  geometry = geometry,
                                  scale = image.projection().nominalScale().getInfo(),
                                  maxPixels = 100000,
                                  bestEffort = True);
        return mean.get('Nt').getInfo()
    Images_do = with_do.select('Nt').toList(with_do.size()) 
    do_coll = []
    date_coll=[]
    
    values = {}
    
    for i in range(Images_do.length().getInfo()):
        image = ee.Image(Images_do.get(i-1))
        temp_do = meanDO(image)
        do_coll.append(temp_do)
        ddate = image.get('system:time_start').getInfo()  # Get the timestamp
        date_coll.append(datetime.datetime.fromtimestamp(ddate / 1000).strftime('%Y-%m-%d'))  # Convert to date string
        print(f"Date: {date_coll[-1]}, Value: {temp_do}")
        values[date_coll[-1]] = temp_do

    print("\n length of data is " + str(len(do_coll)))

    if name:
        insert_data(DB_CONFIG, name, {"NT": values})
    cleaned_data = cleaning(name= "NT", data= values)
    d1 = tuple(values.items())

    print(values)
    if print_data:
        for i in range(len(d1)):
            if d1[i][0] in cleaned_data:
                if values[d1[i][0]] == cleaned_data[d1[i][0]]:
                    print(d1[i], "\t", cleaned_data[d1[i][0]], "\tNo Change")
                else:
                    print(d1[i], "\t", cleaned_data[d1[i][0]],
                          "\tCorrected value")
            else:
                print(d1[i], "\t\t\t\tdata removed during cleaning")

    return cleaned_data


def FC(geometry, start_date, end_date, name= None, print_data=True):
    if name:
        cached_data = fetch(DB_CONFIG, name, ["FC"], start_date, end_date)
        if cached_data:
            return cleaning(name= "FC", data= cached_data["FC"])

    sentinel = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED").\
                    filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).\
                    filterDate(start_date,end_date)
                
    sentinel_AOI = sentinel.filterBounds(geometry)
    def addDO(image):
        do = (ee.Image(-0.1942).multiply(image.select('AOT').divide(image.select('MSK_CLDPRB')))
        .add(ee.Image(20.8806).multiply(image.select('B12').divide(image.select('WVP'))))
        .add(ee.Image(-0.2187).multiply(image.select('B8A').divide(image.select('WVP'))))
        .add(ee.Image(4.9193))
    .rename('FC'))
        return image.addBands(do)
    with_do = sentinel_AOI.map(addDO)
    def meanDO(image):
        image = ee.Image(image)
        mean = image.reduceRegion(reducer = ee.Reducer.mean().setOutputs(['FC']),
                                  geometry = geometry,
                                  scale = image.projection().nominalScale().getInfo(),
                                  maxPixels = 100000,
                                  bestEffort = True);
        return mean.get('FC').getInfo()
    Images_do = with_do.select('FC').toList(with_do.size()) 
    do_coll = []
    date_coll=[]
    
    values = {}
    
    for i in range(Images_do.length().getInfo()):
        image = ee.Image(Images_do.get(i-1))
        temp_do = meanDO(image)
        do_coll.append(temp_do)
        ddate = image.get('system:time_start').getInfo()  # Get the timestamp
        date_coll.append(datetime.datetime.fromtimestamp(ddate / 1000).strftime('%Y-%m-%d'))  # Convert to date string
        print(f"Date: {date_coll[-1]}, Value: {temp_do}")
        values[date_coll[-1]] = temp_do

    print("\n length of data is " + str(len(do_coll)))

    if name:
        insert_data(DB_CONFIG, name, {"FC": values})
    cleaned_data = cleaning(name= "FC", data= values)
    d1 = tuple(values.items())

    print(values)
    if print_data:
        for i in range(len(d1)):
            if d1[i][0] in cleaned_data:
                if values[d1[i][0]] == cleaned_data[d1[i][0]]:
                    print(d1[i], "\t", cleaned_data[d1[i][0]], "\tNo Change")
                else:
                    print(d1[i], "\t", cleaned_data[d1[i][0]],
                          "\tCorrected value")
            else:
                print(d1[i], "\t\t\t\tdata removed during cleaning")

    return cleaned_data
    

def PH(geometry, start_date, end_date, name= None, print_data=True):
    if name:
        cached_data = fetch(DB_CONFIG, name, ["PH"], start_date, end_date)
        if cached_data:
            return cleaning(name= "PH", data= cached_data["PH"])

    sentinel = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED").\
                    filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).\
                    filterDate(start_date,end_date)
                
    sentinel_AOI = sentinel.filterBounds(geometry)
    def addpH(image):
        ph = ee.Image(8.339).subtract(ee.Image(0.827).multiply(image.select('B1').divide(image.select('B8')))).rename('PH')
        return image.addBands(ph)
    with_pH = sentinel_AOI.map(addpH)
    
    def meanpH(image):
        image = ee.Image(image)
        mean = image.reduceRegion(reducer = ee.Reducer.mean().setOutputs(['PH']),
                                  geometry = geometry,
                                  scale = image.projection().nominalScale().getInfo(),
                                  maxPixels = 100000,
                                  bestEffort = True);
        return mean.get('PH').getInfo()
    Images_ph = with_pH.select('PH').toList(with_pH.size())
    ph_coll= []
    date_coll=[]
    for i in range(Images_ph.length().getInfo()):
        image = ee.Image(Images_ph.get(i))
        temp_ph = meanpH(image)
        ph_coll.append(temp_ph)
        ddate = image.get('system:time_start').getInfo()  # Get the timestamp
        date_coll.append(datetime.datetime.fromtimestamp(ddate / 1000).strftime('%Y-%m-%d'))  # Convert to date string
        print(f"Date: {date_coll[-1]}, Value: {temp_ph}")

    print("\n length of data is " + str(len(ph_coll)))

    if name:
        insert_data(DB_CONFIG, name, {"PH": values})
    cleaned_data = cleaning(name= "PH", data= values)
    d1 = tuple(values.items())

    print(values)
    if print_data:
        for i in range(len(d1)):
            if d1[i][0] in cleaned_data:
                if values[d1[i][0]] == cleaned_data[d1[i][0]]:
                    print(d1[i], "\t", cleaned_data[d1[i][0]], "\tNo Change")
                else:
                    print(d1[i], "\t", cleaned_data[d1[i][0]],
                          "\tCorrected value")
            else:
                print(d1[i], "\t\t\t\tdata removed during cleaning")

    return cleaned_data
   

def DO(geometry, start_date, end_date, name= None, print_data=True):    
    if name:
        cached_data = fetch(DB_CONFIG, name, ['DO'], start_date, end_date)
        if cached_data:
            print(cached_data)
            print("OKKKKKKKKKKKKKKKKKKKKKKk")
            return cleaning('DO',cached_data)

    sentinel = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED").\
                    filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).\
                    filterDate(start_date,end_date)
                
    sentinel_AOI = sentinel.filterBounds(geometry)
    def addDO(image):
       
        do = ee.Image(0.0020).multiply(image.select('B8')).add(ee.Image(0.0010).multiply(image.select('B9'))).add(ee.Image(-0.0024).multiply(image.select('B11'))).add(ee.Image(5.3865)).rename('DO')
        return image.addBands(do)
    with_do = sentinel_AOI.map(addDO)
    def meanDO(image):
        image = ee.Image(image)
        mean = image.reduceRegion(reducer = ee.Reducer.mean().setOutputs(['DO']),
                                  geometry = geometry,
                                  scale = image.projection().nominalScale().getInfo(),
                                  maxPixels = 100000,
                                  bestEffort = True);
        return mean.get('DO').getInfo()
    Images_do = with_do.select('DO').toList(with_do.size()) 
    do_coll = []
    date_coll=[]
    
    values = {}
    
    for i in range(Images_do.length().getInfo()):
        image = ee.Image(Images_do.get(i-1))
        temp_do = meanDO(image)
        do_coll.append(temp_do)
        ddate = image.get('system:time_start').getInfo()  # Get the timestamp
        date_coll.append(datetime.datetime.fromtimestamp(ddate / 1000).strftime('%Y-%m-%d'))  # Convert to date string
        print(f"Date: {date_coll[-1]}, Value: {temp_do}")
        values[date_coll[-1]] = temp_do

    if name:
        insert_data(DB_CONFIG, name, {"DO": values})
    cleaned_data = cleaning(name= "DO", data= values,  max_val= 14)
    d1 = tuple(values.items())

    print(values)
    if print_data:
        for i in range(len(d1)):
            if d1[i][0] in cleaned_data:
                if values[d1[i][0]] == cleaned_data[d1[i][0]]:
                    print(d1[i], "\t", cleaned_data[d1[i][0]], "\tNo Change")
                else:
                    print(d1[i], "\t", cleaned_data[d1[i][0]],
                          "\tCorrected value")
            else:
                print(d1[i], "\t\t\t\tdata removed during cleaning")

    return cleaned_data




def cleaning(name, data):
    # Debug: Print the input data structure
    print("Input data structure:", data)

    # Check if the expected keys exist
    if name not in data:
        raise ValueError(f"Key '{name}' not found in the top level of the input data.")
    
    # Check if the second-level key exists
    if name not in data[name]:
        print(f"Warning: Key '{name}' not found in the second level of the input data. Using an empty dictionary.")
        data[name] = {name: {}}

    # Extract the nested dictionary containing the actual data
    data = data[name][name]

    # If data is empty, return an empty dictionary
    if not data:
        print("Warning: No data found for processing.")
        return {}

    # Convert the input dictionary to a DataFrame
    df = pd.DataFrame(list(data.items()), columns=['Date', name])

    # Ensure the 'Date' column is parsed as datetime and set as index
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)

    print("Original Data:")
    print(df.head())

    # Step 1: Remove negative values
    df_cleaned = df[df[name] >= 0]

    # Step 2: Calculate the threshold using IQR
    Q1 = df_cleaned[name].quantile(0.25)
    Q3 = df_cleaned[name].quantile(0.75)
    IQR = Q3 - Q1
    threshold = Q3 + 6.3 * IQR

    print(f"Threshold (Q3 + 6.3 * IQR): {threshold}")

    # Step 3: Remove values above the threshold
    df_cleaned = df_cleaned[df_cleaned[name] <= threshold]

    # Step 4: Smooth the data using a moving median
    df_cleaned[name + '_smoothed'] = df_cleaned[name].rolling(window=1, min_periods=1).median()

    # Step 5: Interpolate missing values
    df_cleaned[name + '_interpolated'] = df_cleaned[name + '_smoothed'].interpolate(method='linear')

    # Step 6: Convert cleaned DataFrame back to dictionary format
    filtered_dict = df_cleaned[name + '_interpolated'].to_dict()

    print("\nCleaned data returned as dictionary")
    print(filtered_dict)
    return filtered_dict
