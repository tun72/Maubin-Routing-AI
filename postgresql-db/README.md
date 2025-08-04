# Route Planner Database

This project provides a PostgreSQL database with PostGIS extension for route planning, managed via Docker Compose.

## Getting Started

### 1. Start the Database

Run the following command to start the database in detached mode:

```bash
docker-compose up -d
```

### 2. Check Database Logs

To verify the database has started correctly, check the logs:

```bash
docker logs route_planner_db
```

You should see output similar to:

```txt
PostgreSQL init process complete; ready for start up
database system is ready to accept connections
```

### 3. Test Database Connection

Run the following command to list tables in the database:

```bash
docker exec route_planner_db psql -U route_admin -d mub_route_planner -c "\dt"
```

## Accessing with pgAdmin

You can use pgAdmin at [http://localhost:8080](http://localhost:8080) to connect to the database.

**Create a new server with the following details:**

- **Name:** Route Planner DB
- **Host:** db
- **Port:** 5432
- **Maintenance database:** mub_route_planner
- **Username:** route_admin
- **Password:** Maubin@10181

---

**Note:**

- Initialization scripts are located in the `init-scripts/` directory.
- Database data is persisted in the `pgdata/` directory.
