import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';
import { Student } from '../types/index';
import { fetchStudents } from '../services/api';

interface StudentContextType {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  triggerRefresh: () => void;
  refreshCounter: number;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  // Function to trigger a refresh
  const triggerRefresh = useCallback(() => {
    console.log('Global refresh triggered', new Date().toISOString());
    setRefreshCounter(prev => prev + 1);
  }, []);

  // Load the students data
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching students in context...', new Date().toISOString());
        const data = await fetchStudents();
        console.log('Students fetched in context:', data.length, new Date().toISOString());
        setStudents(data);
      } catch (err) {
        console.error('Error fetching students in context:', err);
        setError(err instanceof Error ? err.message : 'Failed to load students');
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, [refreshCounter]);

  return (
    <StudentContext.Provider 
      value={{ 
        students, 
        isLoading, 
        error, 
        triggerRefresh, 
        refreshCounter 
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};