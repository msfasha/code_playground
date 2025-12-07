### How to Login to the PostgreSQL Container (`dockerized_postgres_1`) and Execute Commands

1. **Open a shell inside the PostgreSQL container:**
   ```bash
   docker exec -it dockerized_postgres_1 bash
   ```

2. **Connect to the PostgreSQL database using the `psql` client:**
   ```bash
   psql -U <username> <database>
   ```
   - `<username>`: The PostgreSQL user (commonly `postgres`)
   - `<database>`: The database name (commonly `postgres` or as configured)

   Example:
   ```bash
   psql -U postgres
   ```

3. **Now you can execute SQL commands, for example:**
   ```sql
   \dt           -- List tables
   SELECT * FROM my_table;
   ```

4. **To exit `psql`, type:**
   ```
   \q
   ```

**Tip:**  
If you only want to run a single SQL command from outside the container, you can do: