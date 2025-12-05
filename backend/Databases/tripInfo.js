const dbConnection = require("./dbConnection");       // import the database connection

const trip = {
    create: (userId, startLocation, endLocation, startTime, endTime, callback) => {
        const sql = "insert into trips(userId, start_lat, start_long, end_lat, end_long, startTime, endTime) values ( ? , ? , ? , ? , ?)";
        dbConnection.query(sql, [userId, start_lat, start_long, end_lat, end_long, startTime, endTime], callback);
    },

    getByUser: (userId, callback) => {
        const sql = "select * from trips where userId = ?";
        dbConnection.query(sql, [userId], callback);
    }
};
module.exports = trip;