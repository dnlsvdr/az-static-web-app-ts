import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm';
import { getStudent } from '../services/api';
import { Student } from '../types/index';
import { useStudentContext } from '../context/StudentContext';

const EditStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { triggerRefresh } = useStudentContext();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudent(id!);
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmitSuccess = () => {
    triggerRefresh();
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!student) return <div className="alert alert-warning">Student not found</div>;

  return (
    <div className="container">
      <h2>Edit Student</h2>
      <StudentForm student={student} onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
};

export default EditStudent;
