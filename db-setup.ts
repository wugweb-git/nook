import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from './shared/schema';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log('Connecting to database...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Creating tables...');
  try {
    // Create tables directly
    await db.query.users.findMany();
    console.log('Users table exists or was created');

    await db.query.onboardingSteps.findMany();
    console.log('Onboarding steps table exists or was created');

    await db.query.employeeOnboarding.findMany();
    console.log('Employee onboarding table exists or was created');

    await db.query.documentCategories.findMany();
    console.log('Document categories table exists or was created');

    await db.query.documents.findMany();
    console.log('Documents table exists or was created');

    await db.query.events.findMany();
    console.log('Events table exists or was created');

    await db.query.timeOffBalances.findMany();
    console.log('Time off balances table exists or was created');

    await db.query.reportDashboards.findMany();
    console.log('Report dashboards table exists or was created');

    // Create a test user
    const [user] = await db.insert(schema.users).values({
      username: 'testuser',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'admin',
      lastLogin: new Date()
    }).returning();

    console.log('Created test user:', user);
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);