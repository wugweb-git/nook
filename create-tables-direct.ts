import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './shared/schema';
import ws from 'ws';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configure websocket for serverless connection
neonConfig.webSocketConstructor = ws;

// SQL statements for creating tables
const createTablesSql = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
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
);

-- Onboarding steps table
CREATE TABLE IF NOT EXISTS onboarding_steps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  "order" INTEGER NOT NULL
);

-- Employee onboarding table
CREATE TABLE IF NOT EXISTS employee_onboarding (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  step_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  completed_at TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_step FOREIGN KEY (step_id) REFERENCES onboarding_steps (id) ON DELETE CASCADE
);

-- Document categories table
CREATE TABLE IF NOT EXISTS document_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
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
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location TEXT,
  category TEXT,
  created_by INTEGER NOT NULL,
  CONSTRAINT fk_creator FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
);

-- Time off balances table
CREATE TABLE IF NOT EXISTS time_off_balances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  vacation_total INTEGER NOT NULL DEFAULT 20,
  vacation_used INTEGER NOT NULL DEFAULT 0,
  sick_total INTEGER NOT NULL DEFAULT 10,
  sick_used INTEGER NOT NULL DEFAULT 0,
  personal_total INTEGER NOT NULL DEFAULT 5,
  personal_used INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Report dashboards table
CREATE TABLE IF NOT EXISTS report_dashboards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  layout JSONB NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
`;

// Insert initial admin user
const insertAdminUserSql = `
INSERT INTO users (username, password, first_name, last_name, email, role, 
                  department, position, gender, job_area, last_login)
VALUES ('vedanshu', 'WugWeb123@', 'Vedanshu', 'Srivastava', 
        'vedanshu@wugweb.com', 'admin', 'HR', 'HR Director', 
        'male', 'Human Resources', NOW())
ON CONFLICT (username) DO NOTHING
RETURNING id;
`;

// Insert onboarding steps
const insertOnboardingStepsSql = `
INSERT INTO onboarding_steps (name, description, "order")
VALUES 
  ('Personal Information', 'Complete your personal information', 1),
  ('Employment Details', 'Verify your employment details', 2),
  ('Tax Information', 'Provide your tax information', 3),
  ('Company Policy Acknowledgement', 'Read and acknowledge company policies', 4),
  ('Equipment Setup', 'Setup your company equipment', 5)
ON CONFLICT (name) DO NOTHING;
`;

async function main() {
  console.log('Starting database setup with direct PostgreSQL connection...');
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set. Cannot set up database');
    process.exit(1);
  }
  
  console.log('Connecting to database...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Test connection
    console.log('Testing database connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT current_database() as db_name');
    console.log('Connected to database:', result.rows[0].db_name);
    client.release();
    
    // Execute table creation SQL
    console.log('Creating tables...');
    const statements = createTablesSql.split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
      .map(stmt => stmt + ';');
    
    for (const sql of statements) {
      try {
        // Log only first 50 chars of the SQL to keep output clean
        console.log('Executing:', sql.substring(0, 50).replace(/\s+/g, ' ') + '...');
        await pool.query(sql);
        console.log('Success!');
      } catch (error) {
        console.error('Error executing statement:', error.message);
      }
    }
    
    // Insert admin user
    console.log('Creating admin user...');
    try {
      const userResult = await pool.query(insertAdminUserSql);
      if (userResult.rows.length > 0) {
        console.log('Admin user created with ID:', userResult.rows[0].id);
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error creating admin user:', error.message);
    }
    
    // Insert onboarding steps
    console.log('Creating onboarding steps...');
    try {
      await pool.query(insertOnboardingStepsSql);
      console.log('Onboarding steps created');
    } catch (error) {
      console.error('Error creating onboarding steps:', error.message);
    }
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error in database setup:', error);
  } finally {
    await pool.end();
  }
}

main();