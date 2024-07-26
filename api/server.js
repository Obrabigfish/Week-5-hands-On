const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv')
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');


app.use(express.json())
app.use(cors());
dotenv.config();

//Running the server
app.listen(4000, () => {
    console.log("Server is running on PORT 3000");
});


//Connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});


//test connection
db.connect((err) => {
    //If connection does not work
    if (err) return console.log("Error connnecting to MySql");
    //if connection works
    console.log("Conected to MySQL as id: ", db.threadId);

    //create a db
    db.query(`CREATE DATABASE IF NOT EXISTS expense_tracker`, (err, result) => {
        //Error creating DB
        if(err) return console.log("Error Creating Database")
        //If no error
        console.log("db expense_tracker created succesfully");
        //Select the db
        db.changeUser({database: 'expense_tracker'}, (err, result) => {
            //If error changing db
            if(err) console.log("Error selecting db")
            //if no error
            console.log("Expense_tracker is in use")

            //Create Table
            const createUsersTable =`
            CREATE TABLE IF NOT EXISTS users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(250) NOT NULL
            )
            `;

            db.query(createUsersTable, (err, result) => {
                if(err) return console.log("Error creating table")
                console.log("users table created Successfully")
            })
        
        })

    })
})

//User registration
//Create([post]) Read([get]) Update([put]) Delete([delete])
//app.post() - When cerating somthing  app.get() -  app.put() app.delete

app.post('/api/register', async(req, res) => {
    try {
        const users =` SELECT * FROM  users WHERE email = ?`
        db.query(users, [req.body.email], (err, data) => {
            //if email exists
            if(data.length > 0) return res.status(409).json("User already exists")
        })


    } catch (err) {
        res.status(500).json("Internal Server Error");
    }
});

