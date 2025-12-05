const dbConnection = require("./dbConnection");       // import the database connection

const user = {
    create: (username, password, email, name, callback) => {
        const sql = "insert into users(username, password, email, name) values ( ? , ? , ? , ?)";

        dbConnection.query(sql, [username, password, email, name], callback);
    },

    login: (username, callback) => {
        const sql = "select * from users where username = ?";
        dbConnection.query(sql, [username], callback);
    }   

}

module.exports = user;