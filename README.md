# Calculator Project

A small calculator application with a Go REST API and a React/Vite frontend.

## Requirements

For local development:

- Go 1.27.3 or newer
- Node.js 24 or newer and npm

For the containerized setup, install Docker Desktop or Docker Engine with the Compose plugin.

## Local Setup

Install frontend dependencies:

```sh
cd frontend
npm ci
```

Run the backend from a terminal:

```sh
cd backend
go run ./cmd/api
```

The API listens on `http://localhost:8080`.

In a second terminal, start the frontend:

```sh
cd frontend
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`. During development, Vite proxies `/api` requests to the backend on port 8080.

On Windows Command Prompt, the backend helper script can run or test the API:

```cmd
cd backend
run.bat run
```

## Docker Compose

From the repository root, build and start both services:

```sh
docker compose up --build -d
```

Open `http://localhost:8081`. Nginx serves the built frontend and proxies `/api/` requests to the backend container. The backend is only exposed inside the Compose network. The host frontend port is set to 8081 to avoid the common conflict with port 8080.

View service logs or stop the stack with:

```sh
docker compose logs -f
docker compose down
```

## Tests and Checks

Run backend tests from `backend/`:

```sh
go test ./...
```

Run frontend tests, lint, or a production build from `frontend/`:

```sh
npm test
npm run lint
npm run build
```

On Windows, `backend/run.bat test` runs the backend tests.

## REST API

### Calculate

`POST /api/calculate`

The request must be JSON and include `left`, `operator`, and `right`. Values must be numbers; zero is allowed.

Example, using the local backend:

```sh
curl -i -X POST http://localhost:8080/api/calculate \
	-H "Content-Type: application/json" \
	-d '{"left":10,"operator":"+","right":5}'
```

The same API is available through the Compose frontend proxy:

```sh
curl -i -X POST http://localhost:8081/api/calculate \
	-H "Content-Type: application/json" \
	-d '{"left":10,"operator":"percentage","right":25}'
```

Successful response:

```json
{"status":200,"result":2.5}
```

Supported operators are `+`, `-`, `*`, `/`, `%`, `^`, `sqrt`, and `percentage`.

`%` computes the remainder. `percentage` computes the first input as a percentage of the second; for example, `10 percentage 25` returns `2.5`. `sqrt` uses `left` and ignores `right`; it must still be provided in the request.

Errors use a JSON body and an appropriate non-2xx HTTP status. For example, dividing by zero returns HTTP 400:

```json
{"status":400,"error":{"message":"Division by zero."}}
```

The frontend displays the returned error message in an alert.

## Design Decisions and Assumptions

- The backend is the source of truth for calculation results; no computations is made on the frontendm, every calculator is sent as a REST request.
- The API uses `float64` values. Results that become infinite or NaN are rejected, but floating-point values are not intended for exact financial calculations.
- Division by zero, remainder by zero, unsupported operators, malformed JSON, and missing required fields return errors. Only way to send unsupported operators on the frontend is calling the API directly with other values.
- The calculator is a small demonstration app: it has no database, authentication, or saved calculation history.
- Was made with help of Github Copilot.
