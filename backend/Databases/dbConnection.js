const mysql = require("mysql2");        //import mysql this allows node.js to talk to mysql

const db = mysql.createconnection({     //create connection to database
    host: "localhost",
    user: "root",
    password: "",
    database: "DriverStatsDB"
})

db.connect(err => {                     // check connection to database
    if (err) { console.error("Databse connection failed.", err); return; }
    console.log("database connected.");
})


module.exports = db;                    // export the connection to be used in other files