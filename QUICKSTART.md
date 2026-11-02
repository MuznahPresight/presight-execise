# Quick Start Guide

These instructions work on Windows (PowerShell), macOS, and Linux. Run Yarn commands from the repository root unless noted otherwise.

## Prerequisites

- Node.js 24 (required by `package.json`)
- Corepack, included with Node.js, to provide the pinned Yarn version

Check your versions:

```text
node --version
corepack --version
```

If needed, install Node.js 24 from [nodejs.org](https://nodejs.org/). Then enable Corepack:

```text
corepack enable
yarn --version
```

The reported Yarn version should be 4.17.0. You can run these commands in VS Code's integrated terminal. If enabling Corepack reports a permissions error on Windows, reopen VS Code with the required permissions and retry.

## Install and seed the database

Open the project folder in VS Code, then choose **Terminal → New Terminal**. Run:

```text
yarn install
yarn workspace presight-server seed
```

Seeding adds 10,000 Faker-generated users to the SQLite database at `server/data/app.db`. Each run adds more users; existing data is preserved.

## Start the application

From the VS Code integrated terminal at the repository root, start both the API and web client with:

```text
yarn start
```

Open `http://localhost:5173` in your browser. The API listens at `http://localhost:3001`. Keep this terminal running while you use the app.

## Troubleshooting

### Database not found or no users returned

Seed the database from the repository root:

```text
yarn workspace presight-server seed
```

### Cannot connect to the API

Confirm the API server is running and check `http://localhost:3001/health`. The client development server proxies API requests to port 3001.

### A port is already in use

Stop the existing development server using the terminal where it is running, or identify the process using the occupied port and stop that process with your operating system's tools. Vite automatically selects another port if its default port is busy.

## Project layout

- `client/` — React, TypeScript, and Vite application.
- `server/` — Express API and SQLite database.
- `server/data/app.db` — local database created and populated by the seed command.
