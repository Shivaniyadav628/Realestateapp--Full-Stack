const mysql = require("mysql2");

require("dotenv").config();

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "realestateapp",
    connectTimeout: 30000,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// Enable SSL only for Aiven/production
if (process.env.DB_SSL === "true") {
    dbConfig.ssl = {
        rejectUnauthorized: false,
    };
}

const db = mysql.createPool(dbConfig);

db.on("error", (err) => {
    console.error("MySQL pool error:", {
        message: err.message,
        code: err.code,
        fatal: err.fatal,
    });
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", {
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database,
            user: dbConfig.user,
            message: err.message,
            code: err.code,
        });
        return;
    }

    console.log("Connected to MySQL Database");

    connection.release();
});

module.exports = db;