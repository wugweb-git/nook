import { supabase } from './server/supabase';

// SQL to create tables based on our schema
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
  name TEXT NOT NULL,
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

// Function to create default admin user
const createAdminUserSql = `
INSERT INTO users (
  username, password, first_name, last_name, email, role, 
  department, position, gender, job_area, last_login
)
VALUES (
  'vedanshu', 'WugWeb123@', 'Vedanshu', 'Srivastava', 
  'vedanshu@wugweb.com', 'admin', 'HR', 'HR Director', 
  'male', 'Human Resources', NOW()
)
ON CONFLICT (username) DO NOTHING
RETURNING id;
`;

// Function to create onboarding steps
const createOnboardingStepsSql = `
INSERT INTO onboarding_steps (name, description, "order")
VALUES 
  ('Personal Information', 'Complete your personal information', 1),
  ('Employment Details', 'Verify your employment details', 2),
  ('Tax Information', 'Provide your tax information', 3),
  ('Company Policy Acknowledgement', 'Read and acknowledge company policies', 4),
  ('Equipment Setup', 'Setup your company equipment', 5)
ON CONFLICT (name) DO NOTHING;
`;

async function createTables() {
  console.log('Creating tables in Supabase...');
  
  try {
    // Execute SQL to create tables
    const { error: tablesError } = await supabase.rpc('exec_sql', {
      sql_string: createTablesSql
    });
    
    if (tablesError) {
      console.error('Error creating tables:', tablesError);
      
      // Try alternative approach with direct query
      console.log('Trying alternative approach with SQL query...');
      
      // Split the SQL into individual statements and execute them one by one
      const statements = createTablesSql.split(';').filter(statement => statement.trim().length > 0);
      
      for (const statement of statements) {
        const { error } = await supabase.rpc('exec_sql', {
          sql_string: statement + ';'
        });
        
        if (error) {
          console.error('Error executing statement:', statement, error);
        } else {
          console.log('Successfully executed statement:', statement.substring(0, 50) + '...');
        }
      }
    } else {
      console.log('Tables created successfully!');
    }
    
    // Create admin user
    const { data: adminData, error: adminError } = await supabase.rpc('exec_sql', {
      sql_string: createAdminUserSql
    });
    
    if (adminError) {
      console.error('Error creating admin user:', adminError);
    } else {
      console.log('Admin user created or already exists');
    }
    
    // Create onboarding steps
    const { error: stepsError } = await supabase.rpc('exec_sql', {
      sql_string: createOnboardingStepsSql
    });
    
    if (stepsError) {
      console.error('Error creating onboarding steps:', stepsError);
    } else {
      console.log('Onboarding steps created or already exist');
    }
    
    console.log('Database setup complete!');
    
  } catch (error) {
    console.error('Unexpected error in database setup:', error);
  }
}

createTables();