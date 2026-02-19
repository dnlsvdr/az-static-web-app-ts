import React from 'react';
import StudentList from '../components/StudentList';

const Home: React.FC = () => {
    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Student Management</h1>
            </div>
            <StudentList />
        </div>
    );
};

export default Home;
