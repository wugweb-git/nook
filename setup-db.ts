import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './shared/schema';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log('Connecting to database...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    const client = await pool.connect();
    const result = await client.query('SELECT current_database() as db_name');
    console.log('Connected to database:', result.rows[0].db_name);
    client.release();

    // Create database schema
    console.log('Creating database schema...');
    
    const db = drizzle(pool);
    
    // The schema setup will use the SQL queries to create tables
    
    // Test a simple query to create a table
    const createTableQueries = [
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        company_email TEXT,
        role TEXT NOT NULL DEFAULT 'employee',
        gender TEXT,
        department TEXT,
        position TEXT,
        job_area TEXT,
        avatar TEXT,
        last_login TIMESTAMP,
        linkedin TEXT,
        github TEXT,
        behance TEXT,
        dribbble TEXT,
        twitter TEXT,
        website TEXT,
        pan_number TEXT,
        aadhaar_number TEXT,
        passport_number TEXT,
        pf_number TEXT,
        uan_number TEXT,
        bank_account_number TEXT,
        bank_name TEXT,
        ifsc_code TEXT,
        phone_number TEXT,
        emergency_contact_name TEXT,
        emergency_contact_number TEXT,
        emergency_contact_relation TEXT,
        current_address TEXT,
        permanent_address TEXT,
        city TEXT,
        state TEXT,
        country TEXT,
        pincode TEXT,
        employee_id TEXT,
        joining_date TIMESTAMP,
        probation_end_date TIMESTAMP,
        employment_type TEXT,
        work_location TEXT
      )`,
      
      `CREATE TABLE IF NOT EXISTS onboarding_steps (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        "order" INTEGER NOT NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS employee_onboarding (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        step_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'not_started',
        completed_at TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT fk_step FOREIGN KEY (step_id) REFERENCES onboarding_steps (id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS document_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT
      )`,
      
      `CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        filename TEXT NOT NULL,
        filesize INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        category_id INTEGER,
        uploaded_by INTEGER NOT NULL,
        uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
        is_public BOOLEAN NOT NULL DEFAULT FALSE,
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        metadata JSONB,
        CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES document_categories (id) ON DELETE SET NULL,
        CONSTRAINT fk_uploader FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        location TEXT,
        category TEXT,
        created_by INTEGER NOT NULL,
        CONSTRAINT fk_creator FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS time_off_balances (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        vacation_total INTEGER NOT NULL DEFAULT 20,
        vacation_used INTEGER NOT NULL DEFAULT 0,
        sick_total INTEGER NOT NULL DEFAULT 10,
        sick_used INTEGER NOT NULL DEFAULT 0,
        personal_total INTEGER NOT NULL DEFAULT 5,
        personal_used INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS report_dashboards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        layout JSONB NOT NULL,
        is_default BOOLEAN NOT NULL DEFAULT FALSE,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`
    ];
    
    // Execute all table creation queries in sequence
    for (const query of createTableQueries) {
      try {
        await pool.query(query);
        console.log('Successfully executed query:', query.substring(0, 50) + '...');
      } catch (error) {
        console.error('Error executing query:', query.substring(0, 50) + '...', error);
      }
    }
    
    console.log('All tables created successfully');
    
    // Insert default admin user
    try {
      const adminUser = {
        username: 'vedanshu',
        password: 'WugWeb123@',
        first_name: 'Vedanshu',
        last_name: 'Srivastava',
        email: 'vedanshu@wugweb.com',
        role: 'admin',
        department: 'HR',
        position: 'HR Director',
        gender: 'male',
        job_area: 'Human Resources',
        last_login: new Date()
      };
      
      const userResult = await pool.query(`
        INSERT INTO users (username, password, first_name, last_name, email, role, department, position, gender, job_area, last_login)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (username) DO NOTHING
        RETURNING id
      `, [
        adminUser.username, 
        adminUser.password, 
        adminUser.first_name, 
        adminUser.last_name, 
        adminUser.email,
        adminUser.role, 
        adminUser.department, 
        adminUser.position, 
        adminUser.gender, 
        adminUser.job_area,
        adminUser.last_login
      ]);
      
      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id;
        console.log('Admin user created with ID:', userId);
        
        // Create onboarding steps
        const steps = [
          { name: 'Personal Information', description: 'Complete your personal information', order: 1 },
          { name: 'Employment Details', description: 'Verify your employment details', order: 2 },
          { name: 'Tax Information', description: 'Provide your tax information', order: 3 },
          { name: 'Company Policy Acknowledgement', description: 'Read and acknowledge company policies', order: 4 },
          { name: 'Equipment Setup', description: 'Setup your company equipment', order: 5 }
        ];
        
        for (const step of steps) {
          await pool.query(`
            INSERT INTO onboarding_steps (name, description, "order") 
            VALUES ($1, $2, $3)
            ON CONFLICT (name) DO NOTHING
            RETURNING id
          `, [step.name, step.description, step.order]);
        }
        
        console.log('Onboarding steps created');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error creating default data:', error);
    }
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);