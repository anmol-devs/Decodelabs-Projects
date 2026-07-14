# Task Manager API

A production-quality REST API for managing tasks, built with Node.js and Express.js. This project follows MVC architecture with thin controllers, service-layer business logic, centralized validation, and consistent JSON responses.

## Features

- Full CRUD operations for tasks (Create, Read, Update, Replace, Delete)
- RESTful routes under `/api/v1/tasks`
- MVC architecture with clear separation of concerns
- Centralized `ApiResponse` helper for consistent JSON format
- Reusable validation helpers and task validators
- Case-insensitive enum normalization for `status` and `priority`
- Global error handling for malformed JSON and unexpected server errors
- 404 handler for unknown routes
- Environment-based configuration
- In-memory data store (suitable for development and internship demos)
- Security middleware (Helmet, CORS)
- HTTP request logging (Morgan)

## Folder Structure

```
task-manager-api/
├── package.json
├── .gitignore
├── .env.example
├── README.md
├── Task-Manager-API.postman_collection.json
├── server.js
├── app.js
└── src/
    ├── config/
    │   └── env.js
    ├── controllers/
    │   └── taskController.js
    ├── services/
    │   └── taskService.js
    ├── routes/
    │   └── taskRoutes.js
    ├── middlewares/
    │   ├── errorHandler.js
    │   └── notFound.js
    ├── validators/
    │   └── taskValidator.js
    ├── utils/
    │   ├── ApiResponse.js
    │   ├── asyncHandler.js
    │   └── validationHelper.js
    └── data/
        └── tasks.js
```

## Installation

1. Navigate to the project directory:

   ```bash
   cd task-manager-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   ```bash
   cp .env.example .env
   ```

## Environment Variables

| Variable   | Description                          | Default       |
|------------|--------------------------------------|---------------|
| `PORT`     | Server port number                   | `5000`        |
| `NODE_ENV` | Runtime environment (`development`)    | `development` |

## Run Commands

Start the server in production mode:

```bash
npm start
```

Or run the same server with an explicit script name:

```bash
npm run serve
```

Start the server in development mode with auto-reload:

```bash
npm run dev
```

Do not use `npx serve` for this project. That command starts a static file server, not the Express API.

## API Base URL

```
http://localhost:5000/api/v1/tasks
```

## Response Format

All JSON responses follow a consistent envelope.

**Success:**

```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": {}
}
```

**Failure:**

```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": ["Detailed validation or error messages"]
}
```

**No Content (DELETE success):** Returns `204 No Content` with an empty body.

---

## Task Model

| Field         | Type   | Required (Create/Replace) | Description                                      |
|---------------|--------|---------------------------|--------------------------------------------------|
| `id`          | UUID   | Auto-generated            | Unique task identifier                           |
| `title`       | string | Yes                       | 3–100 characters, trimmed                      |
| `description` | string | No                        | Max 500 characters, defaults to `""`             |
| `status`      | enum   | Yes                       | `TODO`, `IN_PROGRESS`, `DONE` (case-insensitive) |
| `priority`    | enum   | Yes                       | `LOW`, `MEDIUM`, `HIGH` (case-insensitive)       |
| `dueDate`     | string | No                        | Valid ISO 8601 date string or `null`             |
| `createdAt`   | string | Auto-generated            | ISO 8601 timestamp                               |
| `updatedAt`   | string | Auto-generated            | ISO 8601 timestamp                               |

---

## Endpoints

### 1. Get All Tasks

| Property    | Value                              |
|-------------|------------------------------------|
| **Method**  | `GET`                              |
| **URL**     | `/api/v1/tasks`                    |
| **Description** | Retrieve all tasks (returns empty array when none exist) |

**Request Body:** None

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "7280830e-718b-4dec-9184-d91636df6e82",
      "title": "Complete project documentation",
      "description": "Write README and Postman collection",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2026-12-31T00:00:00.000Z",
      "createdAt": "2026-07-14T08:26:33.742Z",
      "updatedAt": "2026-07-14T08:26:33.742Z"
    }
  ]
}
```

**Empty List Example — `200 OK`**

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": []
}
```

---

### 2. Create Task

| Property    | Value                              |
|-------------|------------------------------------|
| **Method**  | `POST`                             |
| **URL**     | `/api/v1/tasks`                    |
| **Description** | Create a new task              |

**Request Body:**

```json
{
  "title": "Complete project documentation",
  "description": "Write README and Postman collection",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-12-31T00:00:00.000Z"
}
```

**Validation Rules:**

- `title` — required, string, 3–100 characters (whitespace-only rejected)
- `description` — optional, string, max 500 characters
- `status` — required, one of `TODO`, `IN_PROGRESS`, `DONE` (case-insensitive; hyphens normalized to underscores)
- `priority` — required, one of `LOW`, `MEDIUM`, `HIGH` (case-insensitive)
- `dueDate` — optional, must be a valid ISO 8601 calendar date or date-time if provided; use `null` to clear it in a partial update
- Additional request fields are rejected to keep the task model explicit

**Success Response — `201 Created`**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "7280830e-718b-4dec-9184-d91636df6e82",
    "title": "Complete project documentation",
    "description": "Write README and Postman collection",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-12-31T00:00:00.000Z",
    "createdAt": "2026-07-14T08:26:33.742Z",
    "updatedAt": "2026-07-14T08:26:33.742Z"
  }
}
```

**Error Responses:**

| Status | Condition              | Example Message   |
|--------|------------------------|-------------------|
| `400`  | Validation failure     | `Validation failed` |
| `400`  | Malformed JSON         | `Invalid JSON payload` |
| `400`  | Empty request body `{}`| Missing required fields |

For `PUT`, `PATCH`, and `DELETE`, the task ID must be part of the URL, for example `/api/v1/tasks/<task-id>`.

**Validation Error Example — `400 Bad Request`**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title is required",
    "Status is required",
    "Priority is required"
  ]
}
```

**Invalid JSON Example — `400 Bad Request`**

```json
{
  "success": false,
  "message": "Invalid JSON payload",
  "errors": ["Request body contains malformed JSON"]
}
```

---

### 3. Get Task by ID

| Property    | Value                              |
|-------------|------------------------------------|
| **Method**  | `GET`                              |
| **URL**     | `/api/v1/tasks/:id`                |
| **Description** | Retrieve a single task by UUID |

**Request Body:** None

**URL Parameters:**

| Parameter | Type | Validation        |
|-----------|------|-------------------|
| `id`      | UUID | Must be valid UUID format |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": "7280830e-718b-4dec-9184-d91636df6e82",
    "title": "Complete project documentation",
    "description": "Write README and Postman collection",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-12-31T00:00:00.000Z",
    "createdAt": "2026-07-14T08:26:33.742Z",
    "updatedAt": "2026-07-14T08:26:33.742Z"
  }
}
```

**Error Responses:**

| Status | Condition        | Example Message      |
|--------|------------------|----------------------|
| `400`  | Invalid UUID     | `Validation failed`  |
| `404`  | Task not found   | `Task not found`     |

**Invalid ID Example — `400 Bad Request`**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Task ID must be a valid UUID"]
}
```

**Not Found Example — `404 Not Found`**

```json
{
  "success": false,
  "message": "Task not found",
  "errors": []
}
```

---

### 4. Replace Task (Full Update)

| Property    | Value                              |
|-------------|------------------------------------|
| **Method**  | `PUT`                              |
| **URL**     | `/api/v1/tasks/:id`                |
| **Description** | Fully replace an existing task; `title`, `status`, and `priority` are required |

**Request Body:**

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "dueDate": "2026-11-01T00:00:00.000Z"
}
```

**Validation Rules:** Same as Create Task. `description` and `dueDate` remain optional; omitted values are reset to their defaults (`""` and `null`).

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Task replaced successfully",
  "data": {
    "id": "7280830e-718b-4dec-9184-d91636df6e82",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "dueDate": "2026-11-01T00:00:00.000Z",
    "createdAt": "2026-07-14T08:26:33.742Z",
    "updatedAt": "2026-07-14T08:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Condition              |
|--------|------------------------|
| `400`  | Invalid UUID or validation failure |
| `404`  | Task not found         |

---

### 5. Update Task (Partial Update)

| Property    | Value                              |
|-------------|------------------------------------|
| **Method**  | `PATCH`                            |
| **URL**     | `/api/v1/tasks/:id`                |
| **Description** | Partially update one or more task fields |

**Request Body (at least one field required):**

```json
{
  "status": "done"
}
```

**Validation Rules:**

- At least one of `title`, `description`, `status`, `priority`, `dueDate` must be provided
- Each provided field is validated individually (same rules as create, except fields are optional)
- Whitespace-only `title` values are rejected

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "7280830e-718b-4dec-9184-d91636df6e82",
    "title": "Complete project documentation",
    "description": "Write README and Postman collection",
    "status": "DONE",
    "priority": "HIGH",
    "dueDate": "2026-12-31T00:00:00.000Z",
    "createdAt": "2026-07-14T08:26:33.742Z",
    "updatedAt": "2026-07-14T08:30:15.000Z"
  }
}
```

**Error Responses:**

| Status | Condition                              |
|--------|----------------------------------------|
| `400`  | Invalid UUID, empty body `{}`, or validation failure |
| `404`  | Task not found                         |

**Empty Body Example — `400 Bad Request`**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["At least one field must be provided for update"]
}
```

---

### 6. Delete Task

| Property    | Value                              |
|-------------|------------------------------------|
| **Method**  | `DELETE`                           |
| **URL**     | `/api/v1/tasks/:id`                |
| **Description** | Delete a task by UUID          |

**Request Body:** None

**Success Response — `204 No Content`**

Empty response body.

**Error Responses:**

| Status | Condition        |
|--------|------------------|
| `400`  | Invalid UUID     |
| `404`  | Task not found   |

---

## Global Error Responses

### Unknown Route — `404 Not Found`

```json
{
  "success": false,
  "message": "Route not found",
  "errors": []
}
```

### Internal Server Error — `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Internal Server Error",
  "errors": []
}
```

---

## Postman Collection

Import `Task-Manager-API.postman_collection.json` into Postman to test all endpoints with sample request bodies.

## HTTP Status Code Summary

| Code | Usage                                      |
|------|--------------------------------------------|
| `200`| Successful GET, PUT, PATCH                 |
| `201`| Successful POST (task created)             |
| `204`| Successful DELETE                          |
| `400`| Validation failure or malformed JSON       |
| `404`| Task or route not found                    |
| `500`| Unexpected server error                    |

## Architecture Notes

- **Controllers** — Handle HTTP concerns, input normalization, validation dispatch, and response formatting
- **Services** — Contain business logic and data manipulation
- **Validators** — Centralize all input validation rules
- **Middleware order** — Security → Body parsing → Routes → 404 → Error handler
