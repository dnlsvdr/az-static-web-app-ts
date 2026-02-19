import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Student } from "../shared/studentModel";
import { StudentPayload } from "../shared/studentPayload";
import { initializeDatabase } from "../shared/database";

export async function createStudent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Initialize the database and models before using them
    await initializeDatabase();
    
    // Parse and validate the request body
    const body = await request.json() as StudentPayload;

    context.log("Received payload:", body);

    if (!body.FirstName || !body.LastName || !body.School) {
      return { 
        status: 400, 
        body: JSON.stringify({ message: "FirstName, LastName, and School are required." }), 
        headers: { "Content-Type": "application/json" } 
      };
    }

    // Create a new student using the Student model
    const newStudent = await Student.create(body);

    return { 
      status: 201, 
      body: JSON.stringify(newStudent.toJSON()), 
      headers: { "Content-Type": "application/json" } 
    };
  } catch (err) {
    context.log(`Error: ${err}`);
    context.log(`Error Details: ${JSON.stringify(err, null, 2)}`);
    return { 
      status: 500, 
      body: JSON.stringify({ message: "An error occurred while creating the student." }), 
      headers: { "Content-Type": "application/json" } 
  };
  }
}

app.http('createStudent', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'students',
  handler: createStudent
});
