import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { connectToDatabase, closeDatabaseConnection } from "../shared/database";
import * as sql from "mssql";

export async function getStudents(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  // If running in Azure Static Web Apps, "localhost" DB will not exist.
  // Return mock data so the deployed site works without Azure SQL.
  const isAzure = !!process.env.WEBSITE_HOSTNAME || !!process.env.AZURE_FUNCTIONS_ENVIRONMENT;
  if (isAzure) {
    return {
      status: 200,
      body: JSON.stringify([
        { StudentId: 1, FirstName: "Demo", LastName: "Student", School: "Deployed" },
        { StudentId: 2, FirstName: "Sample", LastName: "User", School: "Deployed" }
      ]),
      headers: { "Content-Type": "application/json" }
    };
  }

  let pool: sql.ConnectionPool | undefined;

  try {
    pool = await connectToDatabase();
    const result = await pool.request().query("SELECT * FROM Students");
    return { body: JSON.stringify(result.recordset), headers: { "Content-Type": "application/json" } };
  } catch (err) {
    context.log(`Error: ${err}`);
    return {
      status: 500,
      body: JSON.stringify({ message: "An error occurred while fetching students." }),
      headers: { "Content-Type": "application/json" }
    };
  } finally {
    if (pool) {
      await closeDatabaseConnection(pool);
    }
  }
}
