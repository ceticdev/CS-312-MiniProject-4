// import pg library
const Pool = require('pg').Pool;

// create new pool with database credentials from environment
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// export pool for use in other modules
module.exports = pool;