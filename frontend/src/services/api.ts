import { Student } from '../types/index';

// Use the environment variables or fallback to the Azure URL
// const BASE_URL = "https://studentfunctionmze.azurewebsites.net/api";

// Determine which API URL to use based on the current hostname
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

// Fix indentation here
const BASE_URL = isLocalhost 
                ? import.meta.env.VITE_LOCAL_API_URL 
                : (import.meta.env.VITE_AZURE_API_URL || '/api');                    

console.log('Using API URL:', BASE_URL);


export const fetchStudents = async (): Promise<Student[]> => {
    console.log('Fetching students from:', `${BASE_URL}/students`);
    const response = await fetch(`${BASE_URL}/students`);
    if (!response.ok) {
        throw new Error('Failed to fetch students');
    }
    return await response.json();
};

export const getStudent = async (id: string): Promise<Student> => {
    console.log('Fetching student with ID:', id);
    const response = await fetch(`${BASE_URL}/students/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch student');
    }
    return await response.json();
};

export const addStudent = async (student: Student): Promise<Student> => {
    console.log('Adding student:', student);
    const response = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    });
    if (!response.ok) {
        throw new Error('Failed to add student');
    }
    return await response.json();
};

export const updateStudent = async (student: Student): Promise<Student | { message: string }> => {
    console.log('Updating student:', student);
    if (!student.StudentId) {
        throw new Error('Student ID is required for update');
    }
    
    const response = await fetch(`${BASE_URL}/students/${student.StudentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    });
    
    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update student');
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to update student');
        }
    }
    
    // Handle both JSON and non-JSON successful responses
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    } else {
        const text = await response.text();
        return { message: text };
    }
};

export const deleteStudent = async (studentId: number): Promise<Student | {}> => {
    console.log('Deleting student with ID:', studentId);
    const response = await fetch(`${BASE_URL}/students/${studentId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete student');
    }
    
    // Special handling for 204 No Content responses
    if (response.status === 204) {
        return {};
    }
    
    return await response.json();
};

export default {
    fetchStudents,
    getStudent,
    addStudent,
    updateStudent,
    deleteStudent
};
