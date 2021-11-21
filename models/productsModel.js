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

/*función para modificar un registro existente en la base de datos, recibe un
objeto con los nuevos datos y el id */
async function modifyProduct(data, id) {
  try {
    const query = "UPDATE products SET ? WHERE id = ?";
    const rows = await pool.query(query, [data, id]);
    return rows;
  } catch (error) {
    throw error;
  }
}
/*función para borrar un registro existente en la base de datos, recibe el id */
async function deleteProduct(id) {
  const query = "DELETE FROM products WHERE id = ?";
  const rows = await pool.query(query, [id]);
  return rows;
}

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  modifyProduct,
};
