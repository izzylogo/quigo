
export type PortalType = 'school' | 'student' | 'individual';

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  studentCount: number;
  activeQuizzes: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classroom: string;
  testsCompleted: number;
  totalTests: number;
  studentId: string;
  status: 'active' | 'pending';
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  dueDate: string;
  status: 'active' | 'completed';
  score?: number;
  proctoringEnabled?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text';
  options?: string[];
  correctAnswer: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: PortalType;
  apiKey?: string;
}
