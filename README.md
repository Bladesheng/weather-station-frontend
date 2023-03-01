# weather-station-frontend

## About this repository

Frontend web app used for displaying data collected by my weather station:

- [Weather station](https://github.com/Bladesheng/weather-station-V1)
- [Backend API](https://github.com/Bladesheng/weather-station-backend)

## Building locally

- Clone the repository, then run dev server with:

```bash
docker compose up -d
```

- The website will run at http://localhost:8000/

GitHub actions build and deploy site whenever something is pushed to main or when PR is merged.

Formatting with `Prettier` and linting with `ESLint`:

```bash
npm run format
npm run lint
```
