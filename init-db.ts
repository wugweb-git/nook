import { Client } from 'pg';
import * as schema from './shared/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, integer, boolean, timestamp, json } from 'drizzle-orm/pg-core';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log('Connecting to database...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    // Initialize Drizzle ORM
    const db = drizzle(client);

    // Create tables manually
    console.log('Creating tables...');

    // Users table
    await client.query(`
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
      )
    `);
    console.log('Users table created');

    // Onboarding steps table
    await client.query(`
      CREATE TABLE IF NOT EXISTS onboarding_steps (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        "order" INTEGER NOT NULL
      )
    `);
    console.log('Onboarding steps table created');

    // Employee onboarding table
    await client.query(`
      CREATE TABLE IF NOT EXISTS employee_onboarding (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        step_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'not_started',
        completed_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (step_id) REFERENCES onboarding_steps (id)
      )
    `);
    console.log('Employee onboarding table created');

    // Document categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS document_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT
      )
    `);
    console.log('Document categories table created');

    // Documents table
    await client.query(`
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
        FOREIGN KEY (category_id) REFERENCES document_categories (id),
        FOREIGN KEY (uploaded_by) REFERENCES users (id)
      )
    `);
    console.log('Documents table created');

    // Events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        location TEXT,
        category TEXT,
        created_by INTEGER NOT NULL,
        FOREIGN KEY (created_by) REFERENCES users (id)
      )
    `);
    console.log('Events table created');

    // Time off balances table
    await client.query(`
      CREATE TABLE IF NOT EXISTS time_off_balances (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        vacation_total INTEGER NOT NULL DEFAULT 20,
        vacation_used INTEGER NOT NULL DEFAULT 0,
        sick_total INTEGER NOT NULL DEFAULT 10,
        sick_used INTEGER NOT NULL DEFAULT 0,
        personal_total INTEGER NOT NULL DEFAULT 5,
        personal_used INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('Time off balances table created');

    // Report dashboards table
    await client.query(`
      CREATE TABLE IF NOT EXISTS report_dashboards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        layout JSONB NOT NULL,
        is_default BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('Report dashboards table created');

    // Add default admin user
    const adminUser = {
      username: 'vedanshu',
      password: 'WugWeb123@',
      first_name: 'Vedanshu',
      last_name: 'Srivastava',
      email: 'vedanshu@wugweb.com',
      role: 'admin',
      department: 'HR',
      position: 'HR Director',
      avatar: '/uploads/profile/vedanshu.jpg',
      gender: 'male',
      job_area: 'Human Resources',
      linkedin: 'linkedin.com/in/vedanshu',
      github: 'github.com/vedanshu',
      twitter: 'twitter.com/vedanshu',
      website: 'vedanshu.dev',
      pan_number: 'ABCDE1234F',
      aadhaar_number: '1234-5678-9012',
      pf_number: 'PF98765432',
      uan_number: 'UAN87654321',
      bank_account_number: '1234567890',
      bank_name: 'HDFC Bank',
      ifsc_code: 'HDFC0001234',
      phone_number: '+91 98765 43210',
      emergency_contact_name: 'Rahul Srivastava',
      emergency_contact_number: '+91 87654 32109',
      emergency_contact_relation: 'Brother',
      current_address: '123 Main Street, Koramangala',
      permanent_address: '123 Main Street, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pincode: '560034',
      employee_id: 'WUG0001',
      joining_date: new Date('2020-01-15').toISOString(),
      probation_end_date: new Date('2020-04-15').toISOString(),
      employment_type: 'full-time',
      work_location: 'hybrid',
      last_login: new Date().toISOString()
    };

    const userResult = await client.query(`
      INSERT INTO users (
        username, password, first_name, last_name, email, 
        role, department, position, avatar, gender, job_area, 
        linkedin, github, twitter, website, 
        pan_number, aadhaar_number, pf_number, uan_number, 
        bank_account_number, bank_name, ifsc_code, 
        phone_number, emergency_contact_name, emergency_contact_number, emergency_contact_relation, 
        current_address, permanent_address, city, state, country, pincode, 
        employee_id, joining_date, probation_end_date, employment_type, work_location, last_login
      ) 
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, 
        $29, $30, $31, $32, $33, $34, $35, $36, $37, $38
      ) 
      ON CONFLICT (username) DO NOTHING
      RETURNING id
    `, [
      adminUser.username, adminUser.password, adminUser.first_name, adminUser.last_name, adminUser.email,
      adminUser.role, adminUser.department, adminUser.position, adminUser.avatar, adminUser.gender, adminUser.job_area,
      adminUser.linkedin, adminUser.github, adminUser.twitter, adminUser.website,
      adminUser.pan_number, adminUser.aadhaar_number, adminUser.pf_number, adminUser.uan_number,
      adminUser.bank_account_number, adminUser.bank_name, adminUser.ifsc_code,
      adminUser.phone_number, adminUser.emergency_contact_name, adminUser.emergency_contact_number, adminUser.emergency_contact_relation,
      adminUser.current_address, adminUser.permanent_address, adminUser.city, adminUser.state, adminUser.country, adminUser.pincode,
      adminUser.employee_id, adminUser.joining_date, adminUser.probation_end_date, adminUser.employment_type, adminUser.work_location, adminUser.last_login
    ]);

    let userId = userResult.rows[0]?.id;
    
    if (!userId) {
      // If the user already exists, get their ID
      const existingUser = await client.query('SELECT id FROM users WHERE username = $1', [adminUser.username]);
      userId = existingUser.rows[0]?.id;
    }
    
    if (userId) {
      console.log(`Admin user created with ID: ${userId}`);
      
      // Create default onboarding steps
      const steps = [
        { name: 'Personal Information', description: 'Complete your personal information', order: 1 },
        { name: 'Employment Details', description: 'Verify your employment details', order: 2 },
        { name: 'Tax Information', description: 'Provide your tax information', order: 3 },
        { name: 'Company Policy Acknowledgement', description: 'Read and acknowledge company policies', order: 4 },
        { name: 'Equipment Setup', description: 'Setup your company equipment', order: 5 }
      ];
      
      for (const step of steps) {
        await client.query(`
          INSERT INTO onboarding_steps (name, description, "order") 
          VALUES ($1, $2, $3)
          ON CONFLICT (name) DO NOTHING
          RETURNING id
        `, [step.name, step.description, step.order]);
      }
      
      // Get all steps
      const stepsResult = await client.query('SELECT id FROM onboarding_steps ORDER BY "order"');
      const stepIds = stepsResult.rows.map(row => row.id);
      
      // Mark all steps as completed for admin
      const now = new Date();
      for (let i = 0; i < stepIds.length; i++) {
        const completedDate = new Date(now);
        completedDate.setDate(completedDate.getDate() - (30 - i * 5)); // Completed over the last month
        
        await client.query(`
          INSERT INTO employee_onboarding (user_id, step_id, status, completed_at)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (user_id, step_id) DO NOTHING
        `, [userId, stepIds[i], 'completed', completedDate.toISOString()]);
      }
      
      // Create default time off balance
      await client.query(`
        INSERT INTO time_off_balances (user_id, vacation_total, vacation_used, sick_total, sick_used, personal_total, personal_used)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id) DO NOTHING
      `, [userId, 30, 8, 15, 2, 10, 3]);
      
      // Create default dashboard
      const dashboardLayout = {
        charts: [
          { type: 'employeeEngagement', title: 'Employee Engagement', timeframe: 'quarterly' },
          { type: 'attrition', title: 'Attrition Rate', timeframe: 'annual' },
          { type: 'recruitment', title: 'Recruitment Metrics', timeframe: 'monthly' }
        ]
      };
      
      await client.query(`
        INSERT INTO report_dashboards (user_id, name, layout, is_default)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, name) DO NOTHING
      `, [userId, 'HR Analytics Dashboard', JSON.stringify(dashboardLayout), true]);
      
      // Create document categories
      const categories = [
        { name: 'Salary Slips', description: 'Monthly salary slips' },
        { name: 'Contracts', description: 'Employment contracts and agreements' },
        { name: 'Policies', description: 'Company policies and guidelines' },
        { name: 'Tax Documents', description: 'Tax-related documents' },
        { name: 'Benefits', description: 'Benefits and insurance information' }
      ];
      
      for (const category of categories) {
        await client.query(`
          INSERT INTO document_categories (name, description)
          VALUES ($1, $2)
          ON CONFLICT (name) DO NOTHING
        `, [category.name, category.description]);
      }
      
      console.log('Database initialized with default data');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

main().catch(console.error);