import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Student } from "../shared/studentModel";
import { initializeDatabase } from "../shared/database";

export async function getStudentById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Initialize the database and models
    await initializeDatabase();
    
    // Retrieve the StudentId from the route parameters
    const studentId = request.params.StudentId;
    
    if (!studentId) {
      return { 
        status: 400, 
        body: JSON.stringify({ message: "Student ID is required." }), 
        headers: { "Content-Type": "application/json" } 
      };
    }
    
    // Find the student by primary key
    const student = await Student.findByPk(studentId);
    
    if (!student) {
      return { 
        status: 404, 
        body: JSON.stringify({ message: "Student not found." }), 
        headers: { "Content-Type": "application/json" } 
      };
    }
    
    // Return the student as JSON
    return { 
      body: JSON.stringify(student.toJSON()),
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    context.log(`Error: ${err}`);
    return { 
      status: 500, 
      body: JSON.stringify({ message: "An error occurred while fetching the student." }), 
      headers: { "Content-Type": "application/json" } 
    };
  }
}

app.http('getStudentById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'students/{StudentId}',
  handler: getStudentById
});
