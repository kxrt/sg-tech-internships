# Summer 2024 Tech Internships - Singapore

This repository hosts the frontend (React, Vite) and backend (Go) code for the [website](https://techinternships.kxrt.me) that displays data from the [main repository](https://github.com/kxrt/Singapore-Summer2024-TechInternships).

## Quickstart

### Prerequisites

1. [Docker](https://www.docker.com/products/docker-desktop)
1. [Go](https://golang.org/doc/install)
1. [Node.js](https://nodejs.org/en)

### Instructions

1. Clone this repository.
2. Rename `.env.example` to `.env`, after which:
   1. Place the GitHub API URL to create new issues inside `.env`.
   2. Place the GitHUB PAT with `public_repo` access inside `.env`.
   3. Create a Google Analytics 4 data stream, and place the measurement ID inside `.env`.
3. Navigate to the root directory and run `docker-compose up --build`.
4.  The frontend is now accessible via `http://localhost:8080`.
5. To remove the containers, run `docker-compose down`.

## Backend

The Go backend defines a RESTful API with 2 routes. They are:

1. `GET /api/internships`

This route fetches data from the Markdown file from the main repository, processes the table data into a list of opportunities separated into summer and off-cycle internship roles, and returns this.

2. `POST /api/internships`

This route allows users to submit an opportunity to the main repository, by connecting to the GitHub API and creating a pre-formatted issue, allowing maintainers to easily update the Markdown file.

Request body:
```
	company    string // company name
	role       string // role name
	link       string // application link
	is_summer  bool   // internship period
```

## Frontend

The React frontend pulls data from the backend API and renders it for the viewers, allowing them to search through available roles and open up applications directly. It also contains a form that allows users to submit new internship opportunities for addition into the main repository. A HTTP proxy is used to channel API requests to the Go backend.

## Hosting

The frontend and backend services run as Docker containers connected through a network in Docker Compose. This itself is running as a systemd service on a personal DigitalOcean droplet, and requests to the website and API are proxied through an Nginx reverse proxy configuration.