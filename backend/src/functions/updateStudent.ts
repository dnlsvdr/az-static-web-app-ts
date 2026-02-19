import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Student } from "../shared/studentModel";
import { StudentPayload } from "../shared/studentPayload";
import { initializeDatabase } from "../shared/database";

export async function updateStudent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

  // Explicitly type the body as Partial<StudentPayload>
  const body = await request.json() as Partial<StudentPayload>;

  // Validate and typecast the payload
  const updates: Partial<StudentPayload> = {
    FirstName: body.FirstName,
    LastName: body.LastName,
    School: body.School,
  };

  if (!updates.FirstName && !updates.LastName && !updates.School) {
    return { 
      status: 400, 
      body: JSON.stringify({ message: "At least one field (FirstName, LastName, School) is required to update." }), 
      headers: { "Content-Type": "application/json" } };
  }

  try {
    // Fetch the student by ID
    const student = await Student.findByPk(studentId);

    if (!student) {
      return { 
        status: 404, 
        body: JSON.stringify({ message: "Student not found." }), 
        headers: { "Content-Type": "application/json" } 
      };
    }

    // Update the student record
    await student.update(updates);

    return { body: JSON.stringify(student), headers: { "Content-Type": "application/json" } };
  } catch (err) {
    context.log(`Error: ${err}`);
    return { 
      status: 500, 
      body: JSON.stringify({ message: "An error occurred while updating the student." }), 
      headers: { "Content-Type": "application/json" } 
    };
  }
}

app.http('updateStudent', {
  methods: ['PUT', 'PATCH'],
  authLevel: 'anonymous',
  route: 'students/{StudentId}',
  handler: updateStudent
});