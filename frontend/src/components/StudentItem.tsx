import React from 'react';
import { Link } from 'react-router-dom';

interface Student {
  StudentId?: number;
  FirstName: string;
  LastName: string;
  School: string;
}

interface StudentItemProps {
  student: Student;
  onDelete: (id: number) => void;
}

const StudentItem: React.FC<StudentItemProps> = ({ student, onDelete }) => {
    return (
        <div className="card student-item h-100">
            <div className="card-body">
                <h5 className="card-title">{student.FirstName} {student.LastName}</h5>
                <p className="card-text mb-2"><strong>School:</strong> {student.School}</p>
                <p className="card-text"><small className="text-muted">ID: {student.StudentId || 'N/A'}</small></p>
                <div className="d-flex gap-2">
                    <Link to={`/edit/${student.StudentId}`} className="btn btn-sm btn-primary">Edit</Link>
                    <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => student.StudentId && onDelete(student.StudentId)}
                        disabled={!student.StudentId}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentItem;
