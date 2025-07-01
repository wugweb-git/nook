import { Pool } from 'pg';

async function testConnection() {
  try {
    // Check if DATABASE_URL exists and log its length without showing actual content
    const dbUrl = process.env.DATABASE_URL;
    console.log('DATABASE_URL length:', dbUrl ? dbUrl.length : 'not set');
    
    if (!dbUrl) {
      console.error('DATABASE_URL is not set. Cannot connect to database.');
      return;
    }
    
    // Check if it appears to be a Supabase URL format
    if (dbUrl.includes('supabase.co')) {
      console.log('Using Supabase URL, need to check connection string format');
    }
    
    console.log('Attempting to connect to database...');
    
    // Create connection pool
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false // Required for Supabase
      }
    });
    
    // Attempt to connect
    const client = await pool.connect();
    console.log('Successfully connected to the database!');
    
    // Get database info
    const dbInfoResult = await client.query(`
      SELECT current_database() as database, 
             current_user as user,
             inet_server_addr() as server_addr,
             inet_server_port() as server_port
    `);
    
    const dbInfo = dbInfoResult.rows[0];
    console.log('Database info:');
    console.log(`- Database: ${dbInfo.database}`);
    console.log(`- User: ${dbInfo.user}`);
    console.log(`- Server: ${dbInfo.server_addr}:${dbInfo.server_port}`);
    
    // Test listing tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\nTables in database:');
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in public schema');
    } else {
      tablesResult.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    }
    
    // Release client and close pool
    client.release();
    await pool.end();
    
    console.log('\nDatabase connection test completed successfully!');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection().catch(console.error);