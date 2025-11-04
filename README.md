# CS 312 Mini Project 4

## Technologies Used

### Backend:
- Node.js
- Express
- PostgreSQL
- pg
- express-session
- bcrypt
- dotenv
- cors

### Frontend:
- React
- React Router
- Create React App (react-scripts)

## How to Run the Project

1. **Install Dependencies:**

   Install dependencies for both the server (root) and the client (client/):

   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

2. **Create a PostgreSQL Database:**

   Install PostgreSQL and create a new database.

   ```bash
   createdb -U postgres your_db_name
   ```

   Replace `your_db_name` with the name you want to give your database.

3. **Create a `.env` File:**

   Create an `.env` file in the root of the project and add the following content. You can use these default values for a local setup, but be sure to change the `SESSION_SECRET` or leave blank for a random one.
   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_DATABASE=your_db_name
   DB_PASSWORD=your_password
   DB_PORT=5432
   SESSION_SECRET=secret_key
   ```
   
   SESSION_SECRET: A static secret is recommended. If left blank, a new one is generated on each server start, which will invalidate all existing user sessions.

4. **Initialize the Database:**

   Run the `init.sql` script to create the necessary tables and insert some sample data.

   ```bash
   psql -U your_db_user -d your_db_name -f init.sql
   ```

5. **Start the Server:**

   You can run the application in two ways:

   A) Development Mode
   This will run the backend server with nodemon and the React client dev server. The client will proxy API requests to the backend.
   
   ```bash
   # Terminal 1: Start the backend server
   npm run dev
   ```
   
   ```bash
   # Terminal 2: Start the frontend client
   npm run client
   ```
   
   Backend API will run on http://localhost:3000.
   
   React App will run on http://localhost:3001
   
   B) Production Mode
   This will build the static React files and serve them directly from the Express server.
   
   ```bash
   # 1. Build the React client
   npm run build
   ```
   ```
   # 2. Start the production server
   npm start
   The application will be served from http://localhost:3000.
   ```
