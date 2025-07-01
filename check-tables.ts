import { supabase } from './server/supabase';

async function checkTables() {
  console.log('Checking tables in Supabase database...');
  
  const tables = [
    'users',
    'onboarding_steps',
    'employee_onboarding',
    'document_categories',
    'documents',
    'events',
    'time_off_balances',
    'report_dashboards'
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.error(`Error checking table ${table}:`, error.message);
        console.log(`Table ${table} may not exist.`);
      } else {
        console.log(`Table ${table} exists. Sample data:`, data);
      }
    } catch (err) {
      console.error(`Exception checking table ${table}:`, err);
    }
  }
}

checkTables();