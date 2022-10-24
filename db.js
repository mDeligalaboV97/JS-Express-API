const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    host: "dbHostName",
    database: "dbUser",
    password: "dbPassword",
    port: 5432,
});

module.exports = pool;