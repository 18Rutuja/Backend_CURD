const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const colors = require('colors');

// Load environment variables
dotenv.config();

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.message.red);
        process.exit(1);
    }
    console.log('MySQL connected'.bgCyan);
});

// Initialize Express application
const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Define CRUD APIs

// Create a new assistant
app.post('/create', (req, res) => {
    const { name, mobile, email, salary, city, country, department, role } = req.body;
    const INSERT_ASSISTANT_QUERY = `INSERT INTO assistants (name, mobile, email, salary, city, country, department, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(INSERT_ASSISTANT_QUERY, [name, mobile, email, salary, city, country, department, role], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error creating assistant' });
        } else {
            res.status(201).json({ id: result.insertId });
        }
    });
});

// Retrieve details of an assistant by ID
app.get('/assistant/:id', (req, res) => {
    const id = req.params.id;
    const SELECT_ASSISTANT_QUERY = `SELECT * FROM assistants WHERE id = ?`;
    db.query(SELECT_ASSISTANT_QUERY, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving assistant details' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'Assistant not found' });
            } else {
                res.status(200).json(result[0]);
            }
        }
    });
});

// Update details of an assistant by ID
app.put('/assistant/:id', (req, res) => {
    const id = req.params.id;
    const { name, mobile, email, salary, city, country, department, role } = req.body;
    const UPDATE_ASSISTANT_QUERY = `UPDATE assistants SET name=?, mobile=?, email=?, salary=?, city=?, country=?, department=?, role=? WHERE id=?`;
    db.query(UPDATE_ASSISTANT_QUERY, [name, mobile, email, salary, city, country, department, role, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error updating assistant details' });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Assistant not found' });
            } else {
                res.status(200).json({ message: 'Assistant details updated successfully' });
            }
        }
    });
});

// Delete an assistant by ID
app.delete('/assistant/:id', (req, res) => {
    const id = req.params.id;
    const DELETE_ASSISTANT_QUERY = `DELETE FROM assistants WHERE id = ?`;
    db.query(DELETE_ASSISTANT_QUERY, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting assistant' });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Assistant not found' });
            } else {
                res.status(200).json({ message: 'Assistant deleted successfully' });
            }
        }
    });
});

// Start the server
app.get("/test", (req, res) => {
    res.status(200).send("<h1>Hello Assistants</h1>");
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgMagenta.white);
});
