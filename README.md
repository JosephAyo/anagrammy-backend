# ANAGRAMMY

This is the backend application for anagrammy

## Pre-requisites
* Docker
* Postgres


## Steps

### 1. Clone repo

```
git clone https://github.com/JosephAyo/anagrammy-backend
```

### 2. Create gitignored files.
They are:
- src/pre-start/env/.env using the .env.example as a template

### 3. Build Docker image.

```
docker build -t anagrammy-api .
```
### 3. Run Docker container.

```
docker-compose -f docker-compose.yml up
```

### 4. Application management