import psycopg2
from collections import defaultdict

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

def create_tables(DB_CONFIG, water_parameters= None):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS locations (
            location_id SERIAL PRIMARY KEY,
            location_name TEXT UNIQUE NOT NULL
        );
    """)
    if not water_parameters:
        water_parameters = ['NDCI','NDTI','NDSI','DO','PH','TEMP','DOM','SM','FC']
    
    for param in water_parameters:
        create_hypertable(param, cur)

    conn.commit()
    cur.close()
    conn.close()
    print("Tables created successfully!")


def create_hypertable(parameter, cur):
    cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {parameter}_values (
            location_id INT REFERENCES locations(location_id),
            timestamp DATE NOT NULL,
            value DOUBLE PRECISION,
            PRIMARY KEY (location_id, timestamp)
        );
            
        -- Convert table to hypertable
        SELECT create_hypertable('{parameter}_values', 'timestamp', if_not_exists => TRUE);
            
        -- Enable compression
        ALTER TABLE {parameter}_values SET (timescaledb.compress, timescaledb.compress_segmentby = 'location_id');
            
        -- Add a compression policy (compresses chunks older than 30 days)
        SELECT add_compression_policy('{parameter}_values', INTERVAL '30 days');
    """)


def insert_data(DB_CONFIG, location_name, data):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    cur.execute("INSERT INTO locations (location_name) VALUES (%s) ON CONFLICT (location_name) DO NOTHING RETURNING location_id;", (location_name,))
    cur.execute("SELECT location_id FROM locations WHERE location_name = %s;", (location_name,))
    location_id = cur.fetchone()[0]


    for parameter, records in data.items():
        for date, value in records.items():
            cur.execute(f"""
                INSERT INTO {parameter}_values (location_id, timestamp, value)
                VALUES (%s, %s, %s)
                ON CONFLICT (location_id, timestamp) DO UPDATE SET value = EXCLUDED.value;
            """, (location_id, date, round(value, 2)))

    conn.commit()
    cur.close()
    conn.close()
    print("Data inserted successfully!")


def fetch(DB_CONFIG, name: str, parameters: list[str], start_date: str, end_date: str):
    """Fetches water parameter data for a given location and date range."""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Get location_id for the given name
    cur.execute("SELECT location_id FROM locations WHERE location_name = %s;", (name,))
    location = cur.fetchone()

    if not location:
        print("Location not found.")
        return None

    location_id = location[0]
    result_data = defaultdict(dict)

    # Query each requested water parameter hypertable
    for param in parameters:
        query = f"""
            SELECT timestamp, value FROM {param}_values
            WHERE location_id = %s AND timestamp BETWEEN %s AND %s
            ORDER BY timestamp;
        """
        cur.execute(query, (location_id, start_date, end_date))
        rows = cur.fetchall()

        # Store results in a structured dictionary
        for timestamp, value in rows:
            result_data[param][timestamp.strftime('%Y-%m-%d')] = round(value, 2)

    cur.close()
    conn.close()

    return dict(result_data)


if __name__ == "__main__":
    pass
    # create_tables(DB_CONFIG, water_parameters = ['SM'])

    # insert_data(DB_CONFIG, "Gangapur Dam", data)

    # data = fetch(DB_CONFIG, "Gangapur Dam", ["TEMP", "PH"], "2021-01-01", "2021-03-01")

    # print(data)