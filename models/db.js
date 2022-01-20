const mysql = require("mysql");
const util = require("util");
//XAMPP config for Win
/* const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB_NAME,
}); */


/* MAMP config for MacBookPro M1 */

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  database: 'coffee_house',
  user: 'root',
  password: 'root',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  port: '8889'
});
pool.query = util.promisify(pool.query);
module.exports = pool;