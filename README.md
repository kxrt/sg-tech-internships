# Summer 2024 Tech Internships - Singapore

This repository hosts the frontend (React, Vite) and backend (Go) code for the [website](https://techinternships.kxrt.me) that displays data from the [main repository](https://github.com/kxrt/Singapore-Summer2024-TechInternships).

## Quickstart

### Prerequisites

1. [Docker](https://www.docker.com/products/docker-desktop)
1. [Go](https://golang.org/doc/install)
1. [Node.js](https://nodejs.org/en)

### Instructions

1. Clone this repository.
2. Create a service account on Firebase, and download the service account key.
   - Name this file `service-account-key.json` and place it in the project root.
3. Rename `.env.example` to `.env`, after which:
   1. Place the GitHub API URL to create new issues inside `.env`.
      -  This URL ends with `/issues`, which is where new GitHub issues will be posted.
   2. Place the GitHUB PAT with `public_repo` access inside `.env`.
      - The PAT authorizes access to make issues from the token creator's account.
   3. Create a Google Analytics 4 data stream, and place the measurement ID inside `.env`.
4. Navigate to the root directory and run `docker-compose up --build`.
5.  The frontend is now accessible via `http://localhost:8080`.
6. To remove the containers, run `docker-compose down`.

## Backend

The Go backend defines a RESTful API with multiple routes. An OpenAPI specification is available in `/backend/docs/openapi.yaml`. The API is documented using Swagger UI, which is accessible at `http://localhost:8080/api/docs`, where requests can be made and responses viewed. This is **not** available on the production website.

They are:

1. `GET /api/internships`

This route fetches data from the PostgreSQL database and returns it.

Periodically, the backend automatically fetches the Markdown file from the main repository, processes the table data into a list of opportunities separated into summer and off-cycle internship roles, and returns this.

Response body:
```
{
  "data": [
    {
      "internship_id": 1,
      "company": "Google",
      "role": "Software Engineering Intern",
      "link": "https://google.com/careers",
      "date_added": "20 Aug 2023",
      "is_summer": true
    }
  ]
}
```

2. `POST /api/internships`

This route allows users to submit an opportunity to the main repository, by connecting to the GitHub API and creating a pre-formatted issue, allowing maintainers to easily update the Markdown file.

Request body:
```
{
  "company": "Google",
  "role": "Software Engineering Intern",
  "link": "https://google.com/careers",
  "is_summer": true
}
```

Response body:
```
{
  "status": "OK"
}
```

1. `GET /api/user`

This route allows users to log in to the website using their Google account, and returns user data from the PostgreSQL database. 

It requires an ID token from the frontend that is verified using the Google API. This token is placed in the `Authorization` header as a Bearer token.

Return format:
```
{
  "data": {
	"user_id": "ABCD",
	"status": {
		"1": "Applied" // internship_id: status
		},
	}
}
```

4. `POST /api/user/update`

This route allows users to update their application status for a particular internship role. It requires an ID token from the frontend that is verified using the Google API. This token is placed in the `Authorization` header as a Bearer token.

Request body:
```
{
  "internship_id": 1,
  "status": "Applied"
}
```

Response body:
```
{
  "status": "OK"
}
```

Additional endpoints:

- `GET /api/ping` - Health check endpoint
- `GET /api/docs` - Swagger UI page
- `GET /api/docs/openapi.json` - OpenAPI specification


## Frontend

The React frontend pulls data from the backend API and renders it for the viewers, allowing them to search through available roles and open up applications directly. It also contains a form that allows users to submit new internship opportunities for addition into the main repository. A HTTP proxy is used to channel API requests to the Go backend.

## Hosting

The frontend and backend services run as Docker containers connected through a network in Docker Compose. This itself is running as a systemd service on a personal DigitalOcean droplet, and requests to the website and API are proxied through an Nginx reverse proxy configuration.