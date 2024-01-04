# Note Taking App

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Dependencies](#dependencies)

## Description

The Note Taking App is a simple CRUD (Create, Read, Update, Delete) API application built with Express.js for managing notes. This project aims to provide a straightforward interface for users to create, retrieve, update, and delete notes.

## Features

- **Create Note**: Add a new note with a title and content.
- **Retrieve Notes**: Get a list of all notes.
- **Retrieve Note by ID**: Retrieve a specific note using its unique identifier.
- **Update Note**: Modify the content or title of an existing note.
- **Delete Note**: Remove a note based on its ID.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/note-taking-app.git
Install dependencies:
  cd note-taking-app
  npm install
Set up environment variables:
  Create a .env file and add necessary configurations. ( PORT, MONGODB_URL, JWT_SECRET)
Run the application:
  npm start or npx nodemon
## Usage
To interact with the API, use tools like Swagger for clear documentation and testing.

Visit http://localhost:8000/api-docs for the Swagger API documentation.
## Endpoints
  /api/create-note: Create a new note.
  /api/retrieve-notes: Retrieve all notes.
  /api/retrieve-note/{id}: Retrieve a specific note by ID.
  /api/update-note/{id}: Update a specific note by ID.
  /api/delete-note/{id}: Delete a specific note by ID.
  /api/generate-token: Generate JWT token.
  
## Authentication
  Authentication is required for accessing endpoints. Obtain a JWT token using the /api/generate-token endpoint.
  Include the generated token in the Authorization header as follows:
    Bearer {your-token}
## Dependencies
  Express.js: Web application framework
  MongoDB: Database for storing notes
  JWT: JSON Web Token for authentication
