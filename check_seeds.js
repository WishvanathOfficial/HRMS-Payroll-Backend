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

    const [results] = await connection.execute('SELECT * FROM SequelizeSeeds');
    console.log('SequelizeSeeds table:');
    console.log(results);

    const [meta] = await connection.execute('SELECT * FROM SequelizeMeta');
    console.log('\nSequelizeMeta table:');
    console.log(meta);

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
