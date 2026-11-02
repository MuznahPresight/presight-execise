# Run with Docker Compose

You need Docker Desktop (Windows/macOS) or Docker Engine with Docker Compose (Linux), and the Docker engine must be running.

1. Open this project folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run:

   ```text
   docker compose up --build
   ```

4. When the app starts, open `http://localhost:3001`.

The first run seeds the database. It is stored in a Docker volume, so it remains available when you stop and restart the app. Keep the terminal open while using the app; press **Ctrl+C** to stop it.

To start it again later, run `docker compose up` from the project folder. To remove the container, run `docker compose down`. To also delete the saved database and start fresh next time, run `docker compose down --volumes`.

If port `3001` is already in use, stop the other app using it or change the port mapping in `docker-compose.yml`.
