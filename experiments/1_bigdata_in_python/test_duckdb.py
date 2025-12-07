import duckdb

parquet_file = r"Z:\HDD_Active\mywork\datasets\BIG DATA\2015 US Coast Guard + NOAA AIS Dataset\2024_NOAA_AIS_logs_01.parquet"

# Connect to an in-memory database
con = duckdb.connect()

# Query the parquet file directly
print(f"Querying file: {parquet_file}")

# Get row count
count = con.sql(f"SELECT COUNT(*) FROM '{parquet_file}'").fetchone()[0]
print(f"Total rows: {count}")

# Get schema
print("\nSchema:")
schema = con.sql(f"DESCRIBE SELECT * FROM '{parquet_file}'").fetchall()
for col in schema:
    print(col)

# Show first 5 rows
print("\nFirst 5 rows:")
rows = con.sql(f"SELECT * FROM '{parquet_file}' LIMIT 5").fetchall()
for row in rows:
    print(row)
print(f"Dataset size (rows): {count}")
