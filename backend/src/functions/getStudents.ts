import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { connectToDatabase, closeDatabaseConnection } from "../shared/database";
import * as sql from "mssql";

export async function getStudents(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  let pool: sql.ConnectionPool | undefined;

  try {
    // Connect to the database using the shared utility
    pool = await connectToDatabase();

    // Execute a query
    const result = await pool.request().query("SELECT * FROM Students");

    // Return the query result as JSON
    return { body: JSON.stringify(result.recordset), headers: { "Content-Type": "application/json" } };
  } catch (err) {
    context.log(`Error: ${err}`);
    return { 
      status: 500, 
      body: JSON.stringify({ message: "An error occurred while fetching students." }), 
      headers: { "Content-Type": "application/json" } 
    };
  } finally {
    // Close the database connection using the shared utility
    if (pool) {
        await closeDatabaseConnection(pool);
    }
  }
}

app.http('getStudents', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'students',
  handler: getStudents
});