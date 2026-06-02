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

    const tables = ['Departments', 'Designations', 'Employees', 'Users', 'Roles'];
    
    for (const table of tables) {
      const [results] = await connection.execute(`SELECT COUNT(*) as count FROM \`${table}\``);
      console.log(`${table}: ${results[0].count} rows`);
    }

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
