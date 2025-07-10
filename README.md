# Voice Journal App

A simple voice journaling application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js
* pnpm

### Installing

1. Clone the repo
   ```sh
   git clone https://github.com/mrazadar/voice-journal-app.git
   ```
2. Install NPM packages
   ```sh
   pnpm install
   ```
3. Create a `.env` file in the root directory and add the following environment variables:
    ```
    PORT=3000
    DB_USER=your_db_user
    DB_HOST=your_db_host
    DB_DATABASE=your_db_name
    DB_PASSWORD=your_db_password
    DB_PORT=your_db_port
    ```

## Usage

Use the following scripts to run the application:

* To start the server:
    ```sh
    pnpm start
    ```
* To start the server in development mode:
    ```sh
    pnpm dev
    ```
* To build the project:
    ```sh
    pnpm build
    ```

## Project Structure

```
/Users/mrazadar/Projects/practice/nodejs/voice-journal-app/
├───.env
├───.gitignore
├───package.json
├───pnpm-lock.yaml
├───README.md
├───tsconfig.json
├───.git/...
├───dist/...
├───node_modules/...
└───src/
    ├───server.ts
    ├───config/
    │   └───db.ts
    ├───controllers/
    │   ├───userController.ts
    │   └───voiceEntryController.ts
    ├───db/
    │   ├───init.sql
    │   └───initialize.ts
    ├───errors/
    │   └───customErrors.ts
    ├───middleware/
    │   ├───auth0.ts
    │   ├───errorHandler.ts
    │   └───userHandler.ts
    ├───routes/
    │   ├───userRoutes.ts
    │   └───voiceEntryRoutes.ts
    ├───schemas/
    │   └───voiceEntry.ts
    └───services/
        └───transcriptionService.ts
```

## Dependencies

* @types/multer: ^2.0.0
* express: ^5.1.0
* express-oauth2-jwt-bearer: ^1.6.1
* multer: ^2.0.1
* pg: ^8.16.3
* pg-large-object: ^2.0.0
* zod: ^3.25.76

## Dev Dependencies

* @types/express: ^5.0.3
* @types/pg: ^8.15.4
* @types/pg-large-object: ^2.0.7
* dotenv: ^17.1.0
* nodemon: ^3.1.10
* ts-node: ^10.9.2
* typescript: ^5.8.3
