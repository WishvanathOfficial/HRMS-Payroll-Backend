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

    console.log('\n=== SequelizeSeeds table structure ===');
    try {
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'SequelizeSeeds' AND TABLE_SCHEMA = 'hrms_payroll'
      `);
      columns.forEach(c => console.log(`  ${c.COLUMN_NAME}: ${c.COLUMN_TYPE}`));
    } catch (err) {
      console.log('  Table might not exist:', err.message);
    }

    console.log('\n=== SequelizeSeeds table data ===');
    try {
      const [results] = await connection.execute('SELECT * FROM SequelizeSeeds');
      console.log(`  Rows: ${results.length}`);
      results.forEach((r, i) => console.log(`  ${i + 1}. ${JSON.stringify(r)}`));
    } catch (err) {
      if (err.code !== 'ER_NO_SUCH_TABLE') throw err;
    }

    console.log('\n=== SequelizeMeta table data (for comparison) ===');
    const [meta] = await connection.execute('SELECT * FROM SequelizeMeta LIMIT 5');
    console.log(`  Rows: ${meta.length}`);
    meta.forEach((r, i) => console.log(`  ${i + 1}. ${JSON.stringify(r)}`));

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
