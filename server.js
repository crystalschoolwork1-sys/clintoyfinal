const express = require("express");
const sqlite3 = require("sqlite3");


const app = express();
const db = new sqlite3.Database("inventory.db");


db.run(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL
    )
`);


app.use(express.json());
app.use(express.static("public"));


// READ all items
app.get("/api/items", function(req, res) {

    db.all("SELECT * FROM items ORDER BY id DESC", function(err, items) {

        res.json(items);

    });

});


// CREATE an item
app.post("/api/items", function(req, res) {

    let name = req.body.name;
    let quantity = req.body.quantity;
    let price = req.body.price;

    db.run(
        "INSERT INTO items (name, quantity, price) VALUES (?, ?, ?)",
        [name, quantity, price],
        function(err) {

            res.status(201).json({ message: "Created" });

        }
    );

});


// UPDATE an item
app.put("/api/items/:id", function(req, res) {

    let name = req.body.name;
    let quantity = req.body.quantity;
    let price = req.body.price;

    db.run(
        "UPDATE items SET name = ?, quantity = ?, price = ? WHERE id = ?",
        [name, quantity, price, req.params.id],
        function(err) {

            res.json({ message: "Updated" });

        }
    );

});


// DELETE an item
app.delete("/api/items/:id", function(req, res) {

    db.run("DELETE FROM items WHERE id = ?", [req.params.id], function(err) {

        res.json({ message: "Deleted" });

    });

});


// DASHBOARD summary
app.get("/api/summary", function(req, res) {

    let sql = `
        SELECT
            COUNT(*) AS totalItems,
            COALESCE(SUM(quantity), 0) AS totalQuantity,
            COALESCE(SUM(quantity * price), 0) AS totalValue
        FROM items
    `;

    db.get(sql, function(err, summary) {

        res.json(summary);

    });

});


app.listen(3000, function() {

    console.log("Running at http://localhost:3000");

});
