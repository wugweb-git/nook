import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configure websocket for serverless connection
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set to run SQL migrations");
}

// Create a centralized view for onboarding status and required fields
const createOnboardingView = `
CREATE OR REPLACE VIEW user_onboarding_status AS
WITH required_fields AS (
  SELECT
    u.id,
    u.is_onboarded,
    u.onboarding_completed_at,
    CASE
      WHEN u.first_name IS NOT NULL THEN true ELSE false
    END AS has_first_name,
    CASE
      WHEN u.last_name IS NOT NULL THEN true ELSE false
    END AS has_last_name,
    CASE
      WHEN u.email IS NOT NULL THEN true ELSE false
    END AS has_email,
    CASE
      WHEN u.phone_number IS NOT NULL THEN true ELSE false
    END AS has_phone,
    CASE
      WHEN u.emergency_contact_name IS NOT NULL AND 
           u.emergency_contact_number IS NOT NULL THEN true ELSE false
    END AS has_emergency_contact,
    CASE
      WHEN u.current_address IS NOT NULL THEN true ELSE false
    END AS has_address,
    CASE
      WHEN u.bank_account_number IS NOT NULL AND 
           u.bank_name IS NOT NULL AND 
           u.ifsc_code IS NOT NULL THEN true ELSE false
    END AS has_bank_details,
    CASE
      WHEN u.pan_number IS NOT NULL THEN true ELSE false
    END AS has_pan,
    CASE
      WHEN u.aadhaar_number IS NOT NULL THEN true ELSE false
    END AS has_aadhaar,
    (
      SELECT COUNT(*) 
      FROM employee_onboarding eo 
      WHERE eo.user_id = u.id AND eo.status = 'completed'
    ) AS completed_steps,
    (
      SELECT COUNT(*) 
      FROM onboarding_steps
    ) AS total_steps
  FROM
    users u
)
SELECT
  id,
  is_onboarded,
  onboarding_completed_at,
  has_first_name,
  has_last_name,
  has_email,
  has_phone,
  has_emergency_contact,
  has_address,
  has_bank_details,
  has_pan,
  has_aadhaar,
  completed_steps,
  total_steps,
  CASE 
    WHEN has_first_name AND
         has_last_name AND
         has_email AND
         has_phone AND
         has_emergency_contact AND
         has_address AND
         has_bank_details AND
         has_pan AND
         has_aadhaar AND
         completed_steps = total_steps THEN true
    ELSE false
  END AS should_be_onboarded,
  (completed_steps::float / NULLIF(total_steps, 0)::float) * 100 AS onboarding_percentage
FROM 
  required_fields;
`;

// Create a function to update the onboarded status in the users table
const createOnboardingTriggerFunction = `
CREATE OR REPLACE FUNCTION update_user_onboarding_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.status = 'completed' THEN
      -- Check if all steps are completed for this user
      IF (
        SELECT COUNT(*) 
        FROM employee_onboarding eo 
        JOIN onboarding_steps os ON eo.step_id = os.id
        WHERE eo.user_id = NEW.user_id AND eo.status = 'completed'
      ) = (
        SELECT COUNT(*) 
        FROM onboarding_steps
      ) THEN
        -- Also check if all required fields are filled
        UPDATE users
        SET 
          is_onboarded = (
            SELECT 
              CASE 
                WHEN phone_number IS NOT NULL AND 
                     emergency_contact_name IS NOT NULL AND 
                     emergency_contact_number IS NOT NULL AND 
                     current_address IS NOT NULL AND 
                     bank_account_number IS NOT NULL AND 
                     bank_name IS NOT NULL AND 
                     ifsc_code IS NOT NULL AND 
                     pan_number IS NOT NULL AND 
                     aadhaar_number IS NOT NULL
                THEN true
                ELSE false
              END
          ),
          onboarding_completed_at = CASE 
            WHEN is_onboarded = false THEN NULL 
            ELSE CURRENT_TIMESTAMP 
          END
        WHERE id = NEW.user_id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

// Create a trigger to execute the function when employee_onboarding is updated
const createOnboardingTrigger = `
DROP TRIGGER IF EXISTS trigger_update_user_onboarding_status ON employee_onboarding;
CREATE TRIGGER trigger_update_user_onboarding_status
AFTER INSERT OR UPDATE ON employee_onboarding
FOR EACH ROW
EXECUTE FUNCTION update_user_onboarding_status();
`;

// Create a trigger to execute the function when user fields are updated
const createUserFieldsTrigger = `
DROP TRIGGER IF EXISTS trigger_update_user_onboarding_status_fields ON users;
CREATE TRIGGER trigger_update_user_onboarding_status_fields
AFTER UPDATE OF 
  phone_number, 
  emergency_contact_name, 
  emergency_contact_number, 
  current_address, 
  bank_account_number, 
  bank_name, 
  ifsc_code, 
  pan_number, 
  aadhaar_number
ON users
FOR EACH ROW
WHEN (
  (OLD.phone_number IS NULL AND NEW.phone_number IS NOT NULL) OR
  (OLD.emergency_contact_name IS NULL AND NEW.emergency_contact_name IS NOT NULL) OR
  (OLD.emergency_contact_number IS NULL AND NEW.emergency_contact_number IS NOT NULL) OR
  (OLD.current_address IS NULL AND NEW.current_address IS NOT NULL) OR
  (OLD.bank_account_number IS NULL AND NEW.bank_account_number IS NOT NULL) OR
  (OLD.bank_name IS NULL AND NEW.bank_name IS NOT NULL) OR
  (OLD.ifsc_code IS NULL AND NEW.ifsc_code IS NOT NULL) OR
  (OLD.pan_number IS NULL AND NEW.pan_number IS NOT NULL) OR
  (OLD.aadhaar_number IS NULL AND NEW.aadhaar_number IS NOT NULL)
)
EXECUTE FUNCTION update_user_onboarding_status();
`;

// Function to execute the SQL migrations
async function runMigrations() {
  console.log('Starting database migrations...');
  
  // Connect to the database
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Execute migrations
    console.log('Creating onboarding view...');
    await pool.query(createOnboardingView);
    console.log('Onboarding view created successfully.');
    
    console.log('Creating onboarding trigger function...');
    await pool.query(createOnboardingTriggerFunction);
    console.log('Onboarding trigger function created successfully.');
    
    console.log('Creating onboarding trigger...');
    await pool.query(createOnboardingTrigger);
    console.log('Onboarding trigger created successfully.');
    
    console.log('Creating user fields trigger...');
    await pool.query(createUserFieldsTrigger);
    console.log('User fields trigger created successfully.');
    
    console.log('All migrations completed successfully!');
    
    // Test the view to ensure it works
    const { rows } = await pool.query('SELECT * FROM user_onboarding_status LIMIT 5');
    console.log('Sample data from onboarding view:', rows);
    
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run the migrations
runMigrations();