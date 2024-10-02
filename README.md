# Todo API

A simple RESTful API for managing todos with status tracking and pagination support.

## Features

- Create, read, update, and delete todos
- Status tracking (open, in progress, completed, archived, cancelled)
- Color coding for todos
- Pagination support
- File-based JSON storage

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Create Todo

- **POST** `/todos`
- **Body**:

```json
{
  "name": "string",
  "status": "string",
  "color": "string"
}
```

- **Status options**: "open", "in progress", "completed", "archived", "cancelled"

### List Todos

- **GET** `/todos?page=1&limit=10`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10, max: 50)

### Get Single Todo

- **GET** `/todos/:id`

### Update Todo

- **PUT** `/todos/:id`
- **Body**:

```json
{
    "name": "string" (optional),
    "status": "string" (optional),
    "color": "string" (optional)
}
```

### Delete Todo

- **DELETE** `/todos/:id`

## Response Examples

### Successful Todo Creation

```json
{
  "id": 1698312045123,
  "name": "Complete project",
  "status": "in progress"
}
```

### List Todos Response

```json
{
    "total": 100,
    "page": 1,
    "limit": 10,
    "todos": [...]
}
```
