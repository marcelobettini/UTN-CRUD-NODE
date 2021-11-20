const mysql = require("mysql");
const util = require("util");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB_NAME,
});

pool.query = util.promisify(pool.query);
module.exports = pool;
