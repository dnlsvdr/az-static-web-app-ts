import React from 'react';
import { deleteStudent } from '../services/api';
import StudentItem from './StudentItem';
import { useStudentContext } from '../context/StudentContext';

const StudentList: React.FC = () => {
    const { students, isLoading, error, triggerRefresh } = useStudentContext();

    const handleDelete = async (studentId: number) => {
        try {
            console.log('Deleting student with ID:', studentId);
            await deleteStudent(studentId);
            console.log('Student deleted, refreshing list');
            triggerRefresh();
        } catch (err) {
            console.error('Error deleting student:', err);
            alert(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    if (isLoading && students.length === 0) return <div>Loading students...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Student List</h2>
                {isLoading && <small className="text-muted">Refreshing...</small>}
            </div>
            <div className="row">
                {students.length === 0 ? (
                    <div className="alert alert-info">No students found. Add some students!</div>
                ) : (
                    students.map((student, index) => (
                        <div key={student.StudentId ?? index} className="col-md-4 mb-4">
                            <StudentItem 
                                student={student} 
                                onDelete={handleDelete} 
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentList;
