import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";
import { supabase } from './supabase';
import ws from 'ws';

// Configure the WebSocket constructor for Neon serverless
neonConfig.webSocketConstructor = ws;

console.log('Setting up database connection...');

// Try to use regular DATABASE_URL with Neon serverless pool
const dbUrl = process.env.DATABASE_URL;
let pool;

try {
  if (dbUrl) {
    pool = new Pool({ connectionString: dbUrl });
    console.log('Database pool created with DATABASE_URL');
  } else {
    console.log('No DATABASE_URL provided, using Supabase API only');
  }
} catch (error) {
  console.error('Error creating database pool:', error);
  console.log('Falling back to Supabase API for database operations');
}

// Initialize Drizzle with the pool if available
export const db = pool ? drizzle(pool, { 
  schema,
  logger: true 
}) : {} as any;

// Add global error handler for pool
if (pool) {
  pool.on('error', (err) => {
    console.error('Unexpected database pool error:', err);
  });
}

// Function to test Supabase connection
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful!');
    console.log('Users data sample:', data);
    return true;
  } catch (err: any) {
    console.error('Supabase connection error:', err?.message || err);
    return false;
  }
}

// Test Supabase connection
testSupabaseConnection();
