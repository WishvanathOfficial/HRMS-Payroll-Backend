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

    const [results] = await connection.execute('SELECT * FROM SequelizeMeta ORDER BY name');
    console.log('=== All SequelizeMeta entries ===');
    results.forEach((r, i) => console.log(`${i + 1}. ${r.name}`));

    // Count seeders in SequelizeMeta
    const seederCount = results.filter(r => r.name.startsWith('202601010000')).length;
    const otherCount = results.length - seederCount;
    console.log(`\nSeeders in SequelizeMeta: ${seederCount}`);
    console.log(`Other entries: ${otherCount}`);

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
