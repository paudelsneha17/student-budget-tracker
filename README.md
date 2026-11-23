# Student Budget Tracker

A simple web app that helps college students keep track of the money coming in and going out. You can log income and expenses, sort them into categories, and see your balance and where your money is going.

## Project Status

**MVP (Sprint 1) complete.**

| Feature | Status |
|---|---|
| Add income and expense transactions | Done |
| Categories (Food, Rent, Books, Transport, Fun, Income, Other) | Done |
| Delete a transaction | Done |
| Summary cards: income, expenses, balance | Done |
| Spending by category view | Done |
| Input validation (positive amounts, required fields) | Done |
| Automated API tests (Jest + Supertest) | Done |
| Docker container | Done |
| CI/CD with GitHub Actions | Done |
| Deployed to Google Cloud Run | Done |
| Save data in a database (data resets on restart right now) | Planned for Sprint 2 |
| User accounts / login | Planned for Sprint 2 |
| Monthly budget limits and alerts | Planned for Sprint 2 |

**Live app:** https://student-budget-tracker-2jozajjuoa-uc.a.run.app

## Tech Stack

- **Backend:** Node.js + Express (REST API)
- **Frontend:** HTML, CSS, and plain JavaScript (served by Express)
- **Testing:** Jest + Supertest
- **Containerization:** Docker, Docker Compose
- **Cloud:** Google Cloud Run, Google Container Registry
- **CI/CD:** GitHub Actions
- **Project management:** Jira (Scrum board) and Confluence

## Project Structure

```
student-budget-tracker/
├── .github/workflows/deploy.yml   # CI/CD pipeline
├── public/                        # Frontend
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   ├── app.js                     # Express app and API routes
│   └── server.js                  # Starts the server
├── test/api.test.js               # API tests
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Setup Instructions

### Run locally with Node

You need Node.js 18 or newer.

```bash
git clone https://github.com/paudelsneha17/student-budget-tracker.git
cd student-budget-tracker
npm install
npm start
```

Open http://localhost:8080

### Run the tests

```bash
npm test
```

### Run with Docker

```bash
docker compose up --build
```

Open http://localhost:8080

## API Endpoints

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | List of categories |
| GET | `/api/transactions` | List all transactions |
| POST | `/api/transactions` | Add a transaction (`description`, `amount`, `type`, `category`, `date`) |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/summary` | Total income, expenses, balance, and spending by category |

## Deployment

Every push to `main` runs the GitHub Actions pipeline:

1. Install dependencies and run the Jest tests.
2. If the tests pass, build the Docker image and push it to Google Container Registry.
3. Deploy the image to Google Cloud Run (`us-central1`).

Pull requests only run the tests, so broken code is caught before it is merged. The pipeline uses three GitHub repository secrets: `GCP_SA_KEY`, `GCP_PROJECT_ID`, and `GCP_REGION`.

## Git Workflow

Every feature was built on its own branch and merged into `main` through a pull request:

- `feature/backend-api` → PR #1
- `feature/frontend-ui` → PR #2
- `feature/docker` → PR #3
- `feature/ci-cd` → PR #4
- `docs/readme` → PR #5

## AI Tool Usage

I used AI tools throughout this project and reviewed and tested everything they produced.

| Tool | What I used it for |
|---|---|
| Claude (Anthropic) | Planning the MVP scope, writing the Express API and frontend, writing the Jest tests, creating the Dockerfile and GitHub Actions workflow, and drafting this README |
| Claude (Anthropic) | Walking through Google Cloud setup: creating a service account, giving it the right roles, and adding GitHub secrets |

What I learned from using AI: it was fast for boilerplate like the Dockerfile and workflow, but I still had to check the details myself, like making sure the Cloud Run port matched the app's port and that the tests actually covered the summary math.

## Author

Sneha Paudel, Loras College
