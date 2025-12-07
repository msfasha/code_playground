import pyarrow.parquet as pq

parquet_file = r"Z:\HDD_Active\mywork\datasets\BIG DATA\2015 US Coast Guard + NOAA AIS Dataset\2024_NOAA_AIS_logs_01.parquet"

print(f"Querying file: {parquet_file}")

# Open the file using PyArrow to read metadata without loading the whole file
parquet_file_obj = pq.ParquetFile(parquet_file)

# Get row count from metadata
count = parquet_file_obj.metadata.num_rows
print(f"Total rows: {count}")

# Get schema
print("\nSchema:")
print(parquet_file_obj.schema)

# Show first 5 rows
# Read only the first row group (or a subset if possible) to get the head
print("\nFirst 5 rows:")
# iter_batches() allows reading in chunks. We just need the first chunk.
first_batch = next(parquet_file_obj.iter_batches(batch_size=5))
df_head = first_batch.to_pandas()
print(df_head)

print(f"Dataset size (rows): {count}")
