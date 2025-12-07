### How to Login to the Cassandra Container (`dockerized_cassandra_1`) and Execute Commands

1. **Open a shell inside the Cassandra container:**
   ```bash
   docker exec -it dockerized_cassandra_1 bash
   ```

2. **Connect to the Cassandra database using the `cqlsh` client:**
   ```bash
   cqlsh
   ```

3. **Now you can execute CQL (Cassandra Query Language) commands, for example:**
   ```sql
   DESCRIBE KEYSPACES;      -- List all keyspaces
   USE my_keyspace;         -- Switch to a keyspace
   SELECT * FROM my_table;  -- Query a table
   ```

4. **To exit `cqlsh`, type:**
   ```
   exit
   ```

**Tip:**  
If you only want to run a single CQL command from outside the container, you can do:
```bash
docker exec -it dockerized_cassandra_1 cqlsh -e "<CQL_COMMAND>"
```
Replace `<CQL_COMMAND>` with your query, for example:
```bash
docker exec -it dockerized_cassandra_1 cqlsh -e "DESCRIBE KEYSPACES;"
```