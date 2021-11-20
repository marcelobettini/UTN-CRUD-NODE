const pool = require("./db");
const md5 = require("md5");
async function getUserByUserAndPass(user, pass) {
  try {
    const query =
      "select * from users where user_name = ? and user_pass = ? limit 1";
    const row = await pool.query(query, [user, md5(pass)]);
    return row[0];
  } catch (error) {
    throw error;
  }
}

module.exports = { getUserByUserAndPass };
