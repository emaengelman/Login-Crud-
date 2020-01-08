const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require ('./keys');

const pool = mysql.createPool(database);
pool.getConnection((err, connection)=>{
    if(err){
        if (err.code === 'PROTOCOL_CONNECTION_ERROR'){
            console.error('DATABASE CONNECTION WAS CLOSED')
        }
        if(err.code === 'ERR_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANNY CONNECTIONS');

        }
        if(err.code === 'ECONNREFUSED'){
        console.error('DATABASE CONNECTION WAS REFUSED');
    }
}
if(connection) connection.release();
console.log('DB IS CONNNECTED MEN!');
return;
});
//Conviritiendo collbacks en promesas
pool.query = promisify(pool.query);

module.exports = pool;