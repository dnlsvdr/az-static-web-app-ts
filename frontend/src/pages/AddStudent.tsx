import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm';
import { useStudentContext } from '../context/StudentContext';

const AddStudent: React.FC = () => {
  const navigate = useNavigate();
  const { triggerRefresh } = useStudentContext();

  const handleSubmitSuccess = () => {
    triggerRefresh();
    navigate('/');
  };

  return (
    <div className="container">
      <h1>Add New Student</h1>
      <StudentForm onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
};

export default AddStudent;
