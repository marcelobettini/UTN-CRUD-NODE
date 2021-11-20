const pool = require("./db");
async function getProducts() {
  try {
    const query = "select * from products";
    const rows = await pool.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { getProducts };
