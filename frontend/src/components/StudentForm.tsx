import React, { useState, useEffect } from 'react';
import { addStudent, updateStudent } from '../services/api';

interface Student {
  StudentId?: number;
  FirstName: string;
  LastName: string;
  School: string;
}

interface StudentFormProps {
  student?: Student;
  onSubmitSuccess: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmitSuccess }) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [school, setSchool] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (student) {
            setFirstName(student.FirstName || '');
            setLastName(student.LastName || '');
            setSchool(student.School || '');
        }
    }, [student]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with:', { firstName, lastName, school });
        setError('');
        setSubmitting(true);
        
        try {
            if (student && student.StudentId) {
                console.log('Updating student with ID:', student.StudentId);
                await updateStudent({ 
                    StudentId: student.StudentId, 
                    FirstName: firstName, 
                    LastName: lastName, 
                    School: school 
                });
            } else {
                console.log('Adding new student');
                await addStudent({ 
                    FirstName: firstName, 
                    LastName: lastName, 
                    School: school 
                });
            }
            console.log('Operation successful, calling onSubmitSuccess');
            onSubmitSuccess();
            clearForm();
        } catch (error) {
            console.error("Error submitting form:", error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setSchool('');
    };

    return (
        <form onSubmit={handleSubmit} className="student-form">
            <div className="mb-3">
                <label className="form-label">First Name:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Last Name:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                />
            </div>
            <div className="mb-3">
                <label className="form-label">School:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={school} 
                    onChange={(e) => setSchool(e.target.value)} 
                    required 
                />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
            >
                {submitting ? 'Processing...' : (student ? 'Update Student' : 'Add Student')}
            </button>
        </form>
    );
};

export default StudentForm;