const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql/msnodesqlv8");
const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());

const config = {
  server: "DESKTOP-KGPGJ8V\\SQLEXPRESS",
  database: "foodsDb",
  user: "sa",
  password: "12345",
  options: {
    trustedConnection: true,
  },
};
async function getProductByString(string) {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("productName", sql.VarChar, `%${string}%`)
      .query("SELECT * FROM foods WHERE foodName LIKE @productName");
    return result.recordset;
  } catch (err) {
    throw new Error("Error fetching records from database: " + err.message);
  }
}

async function createProduct(product) {
  try {
    const pool = await sql.connect(config);
    const check = await pool
    .request()
    .input("description", sql.VarChar, product.description)
    .query(
      "SELECT foodName FROM foods WHERE foodName = @description"
    );

    const existingRecordCount = check.recordsets[0].length;

    if(existingRecordCount==0){
      const result = await pool
      .request()
      .input("description", sql.VarChar, product.description)
      .input("kcal", sql.Int, product.kcal)
      .input("protein", sql.Int, product.protein)
      .input("fat", sql.Int, product.fat)
      .input("carbs", sql.Int, product.carbs)
      .query(
        "INSERT INTO foods (foodName, kcal, protein, fats, carbs) VALUES (@description, @kcal, @protein, @fat, @carbs)"
      );
    return "Success !";
    }else{
      return "Sorry !";
    }
  } catch (err) {
    throw new Error("Error creating record in database: " + err.message);
  }
}

app.get("/", async (req, res) => {
  try {
    const searchTerm = req.query.term || "";
    const records = await getProductByString(searchTerm);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/create", async (req, res) => {
  try {
    const result = await createProduct(req.body.food);
    if(result=="Success !"){
      res.status(200).send({messageTitle: "Success", message: "Successfully created food entry." });
    }else if(result=="Sorry !"){
      res.status(200).send({messageTitle: "Sorry", message: "Sorry, we already have a food with this name." });
    }
  } catch (error) {
    res.status(500).send("Failed to create food entry.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
