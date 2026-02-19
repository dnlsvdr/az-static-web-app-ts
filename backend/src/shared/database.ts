import * as sql from "mssql";
import { Sequelize, DataTypes } from "sequelize";
import { Student, StudentModel } from "./studentModel";

// Parse the connection string from environment variables
const connectionString: string | undefined = process.env.SQL_SERVER_CONNECTION_STRING;

// Sequelize instance
let sequelizeInstance: Sequelize | null = null;

export async function connectToDatabase(): Promise<sql.ConnectionPool> {
  try {
    console.log('Attempting database connection...');
    
    if (!connectionString) {
      console.error('SQL_SERVER_CONNECTION_STRING environment variable is not set');
      throw new Error('Database connection string is not configured');
    }
    
    const pool: sql.ConnectionPool = await sql.connect(connectionString);
    console.log('Database connection established successfully');
    return pool;
  } catch (err: any) {
    console.error('Database connection failed:', err.message);
    console.error('Stack trace:', err.stack);
    throw err;
  }
}

export async function closeDatabaseConnection(pool: sql.ConnectionPool): Promise<void> {
  try {
    if (pool) {
      await pool.close();
      console.log('Database connection closed successfully');
    }
  } catch (err: any) {
    console.error('Error closing database connection:', err.message);
    console.error('Stack trace:', err.stack);
  }
}

export function getSequelize(): Sequelize {
  if (!sequelizeInstance) {
    if (!connectionString) {
        throw new Error("SQL_SERVER_CONNECTION_STRING environment variable is not set");
    }
    
    // Parse the connection string to extract needed parameters
    const connectionParts = connectionString.split(';');
    const serverPart = connectionParts.find(part => part.toLowerCase().startsWith('server='));
    const databasePart = connectionParts.find(part => part.toLowerCase().startsWith('database='));
    const userPart = connectionParts.find(part => part.toLowerCase().startsWith('uid='));
    const passwordPart = connectionParts.find(part => part.toLowerCase().startsWith('pwd='));
    
    if (!serverPart || !databasePart || !userPart || !passwordPart) {
        throw new Error("Connection string is missing required parts");
    }
    
    // Extract server and port from the server part
    const serverValue = serverPart.split('=')[1];
    let host: string;
    let port: number;
    
    // Handle "Server=tcp:127.0.0.1,1444" or "Server=myserver.database.windows.net" formats
    if (serverValue.includes(',')) {
      // Format: server,port (e.g., "tcp:127.0.0.1,1444")
      const serverParts = serverValue.replace('tcp:', '').split(',');
      host = serverParts[0];
      port = parseInt(serverParts[1], 10);
    } else if (serverValue.includes(':')) {
      // Format: protocol:server (e.g., "tcp:myserver.database.windows.net")
      host = serverValue.split(':')[1];
      port = 1433; // Default SQL Server port in Azure
    } else {
      // Just a server name
      host = serverValue;
      port = 1433; // Default SQL Server port
    }
    
    // Replace IP with 'localhost' if needed to avoid RFC 6066 warnings
    if (host === '127.0.0.1') {
      host = 'localhost';
    }
    
    // Extract other values
    const database = databasePart.split('=')[1];
    const username = userPart.split('=')[1];
    const password = passwordPart.split('=')[1];
    
    console.log(`Connecting to ${host}:${port} as ${username}`);
    
    // Create a new Sequelize instance with the parsed parameters
    sequelizeInstance = new Sequelize({
      dialect: "mssql",
      host: host,
      port: port,
      database: database,
      username: username,
      password: password,
      logging: false,
      dialectOptions: {
        options: {
          trustServerCertificate: true,
          encrypt: true  // Required for Azure SQL
        }
      }
    });
    
    // Initialize the Student model
    Student.init(StudentModel, {
      sequelize: sequelizeInstance,
      modelName: "Student",
      tableName: "Students",
      timestamps: false
    });
  }
  
  return sequelizeInstance;
}

// Ensure database connection and model synchronization
export async function initializeDatabase(): Promise<void> {
  try {
    const sequelize = getSequelize();
    await sequelize.authenticate();
    console.log("Sequelize database connection established successfully");
    await sequelize.sync();
    console.log("Database models synchronized");
  } catch (err) {
    console.error("Unable to connect to the database or synchronize models:", err);
    throw err;
  }
}