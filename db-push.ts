import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from './shared/schema';
import ws from 'ws';

// Configure the WebSocket constructor for Neon serverless
(Pool as any).webSocketConstructor = ws;

async function main() {
  console.log('Starting database migration...');
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL not set. Cannot perform migration.');
    process.exit(1);
  }
  
  try {
    console.log('Connecting to database...');
    const pool = new Pool({ connectionString: dbUrl });
    const db = drizzle(pool, { schema });
    
    console.log('Running push migration...');
    // This will create all tables defined in the schema
    await db.insert(schema.users).values({
      username: 'admin',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      role: 'admin'
    }).onConflictDoNothing();
    
    console.log('Migration complete!');
    await pool.end();
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

main();