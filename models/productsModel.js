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
async function getProduct(id) {
  try {
    const query = "SELECT * FROM products WHERE id =?";
    const rows = await pool.query(query, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function addProduct(data) {
  try {
    const query = "INSERT INTO products SET ?";
    const rows = await pool.query(query, [data]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function deleteItem(id) {
  const query = "DELETE FROM products WHERE id = ?";
  const rows = await pool.query(query, [id]);
  return rows;
}

module.exports = { getProducts, getProduct, addProduct, deleteItem };
