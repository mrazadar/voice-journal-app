import pool from "../config/db";

import fs from "fs";
import path from "path";

export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    const schemaSql = fs
      .readFileSync(
        //readFileSync reads the file and returns a promise
        path.join(__dirname, "init.sql") //path.join joins the path of the file with the path of the file
      )
      .toString();
    await client.query(schemaSql); // execute the sql query
    console.log("Database schema initialized successfully");
    client.release(); // release the client to the pool
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1); // exit the process with an error code
  }
}
