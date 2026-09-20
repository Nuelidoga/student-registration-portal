const sql = require("mssql");

let poolPromise;

function getPool() {

    if (!poolPromise) {

        const config = {

            user: process.env.DB_USER,

            password: process.env.DB_PASSWORD,

            server: process.env.DB_SERVER,

            database: process.env.DB_DATABASE,

            options: {

                encrypt: true,

                trustServerCertificate: false

            },
           connectionTimeout: 30000,
           requestTimeout: 30000 

        };

        poolPromise = sql.connect(config);

    }

    return poolPromise;
}

module.exports = {
    sql,
    getPool
};
