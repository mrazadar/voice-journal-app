/**
 * Initialize the database
 * Please explain the purpose of this sql files and the commands used in it
 * This file is used to create the database tables and columns
 *
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  auth0_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Voice Entries table
CREATE TABLE IF NOT EXISTS voice_entries (
  id SERIAL PRIMARY KEY, -- SERIAL is a type of integer that auto increments
  user_id INTEGER NOT NULL REFERENCES users(id) on DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  audio_oid OID NOT NULL, -- OID is a type of string that represents a file path or large object
  transcription TEXT, -- placeholder for future analysis
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
