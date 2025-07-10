"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const db_1 = __importDefault(require("../config/db"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function initializeDatabase() {
    try {
        const client = await db_1.default.connect();
        const schemaSql = fs_1.default
            .readFileSync(
        //readFileSync reads the file and returns a promise
        path_1.default.join(__dirname, "init.sql") //path.join joins the path of the file with the path of the file
        )
            .toString();
        await client.query(schemaSql); // execute the sql query
        console.log("Database schema initialized successfully");
        client.release(); // release the client to the pool
    }
    catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1); // exit the process with an error code
    }
}
