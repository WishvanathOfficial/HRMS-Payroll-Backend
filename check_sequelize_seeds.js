const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'Admin@123',
      database: 'hrms_payroll'
    });

    try {
      const [results] = await connection.execute('SELECT * FROM SequelizeSeeds');
      console.log('SequelizeSeeds table contents:');
      console.log(results);
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        console.log('SequelizeSeeds table does not exist');
      } else {
        throw err;
      }
    }

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
