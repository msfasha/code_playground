### Useful Docker and Docker Compose Commands

#### Docker

- **List all running containers**
  ```bash
  docker ps
  ```

- **List all containers (including stopped)**
  ```bash
  docker ps -a
  ```

- **View logs for a container**
  ```bash
  docker logs <container_name_or_id>
  ```

- **Start a stopped container**
  ```bash
  docker start <container_name_or_id>
  ```

- **Stop a running container**
  ```bash
  docker stop <container_name_or_id>
  ```

- **Remove a container**
  ```bash
  docker rm <container_name_or_id>
  ```

- **Remove all stopped containers**
  ```bash
  docker container prune
  ```

- **List all images**
  ```bash
  docker images
  ```

- **Remove an image**
  ```bash
  docker rmi <image_name_or_id>
  ```

- **Open a shell inside a running container**
  ```bash
  docker exec -it <container_name_or_id> bash
  ```

- **Copy files from/to a container**
  ```bash
  docker cp <container_name_or_id>:<path_in_container> <path_on_host>
  docker cp <path_on_host> <container_name_or_id>:<path_in_container>
  ```

#### Docker Compose

- **Start all services in the background**
  ```bash
  docker-compose up -d
  ```

- **Start all services (show logs in terminal)**
  ```bash
  docker-compose up
  ```

- **Stop all running services**
  ```bash
  docker-compose down
  ```

- **Rebuild images and restart services**
  ```bash
  docker-compose up --build
  ```

- **View logs for all services**
  ```bash
  docker-compose logs -f
  ```

- **View logs for a specific service**
  ```bash
  docker-compose logs -f <service_name>
  ```

- **List running services/containers**
  ```bash
  docker-compose ps
  ```

- **Run a one-off command in a service container**
  ```bash
  docker-compose exec <service_name> <command>
  # Example: docker-compose exec server bash
  ```

- **Stop a specific service**
  ```bash
  docker-compose stop <service_name>
  ```

- **Remove stopped service containers**
  ```bash
  docker-compose rm
  ```

**Tip:**  
If you are using Docker Compose V2 (with the `docker compose` command instead of `docker-compose`), just replace `docker-compose` with `docker compose` in the above commands.








