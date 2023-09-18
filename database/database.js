
const mysql = require('mysql2/promise');
const ENV = require('dotenv').config().parsed;
const db= {
      host: ENV.DB_HOST,
      user: ENV.DB_USER,
      password: ENV.DB_PASS,
      database: ENV.DB_NAME,
      connectTimeout: 60000
    };
    const  authentication = async ({username, password}) => {
        const connection = await mysql.createConnection(db);
        const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        const [results, ] = await connection.execute(sql);
        return results;
      }

      const signup = async ({username, password}) => {
        const connection = await mysql.createConnection(db);
        const sql = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
        try {
        await connection.execute(sql);
        }
        catch(err){
          return false;
        }
        return true;
        }

module.exports = {
    authenticate: authentication,
    signup: signup
}

