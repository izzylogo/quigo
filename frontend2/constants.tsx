
import React from 'react';
import { Shield, Zap, Globe, Cpu, School, User, GraduationCap, Database, Brain, Users } from 'lucide-react';

export const LOGOS = [
  { name: 'Stanford', icon: <Globe className="w-6 h-6" /> },
  { name: 'MIT', icon: <Database className="w-6 h-6" /> },
  { name: 'Google AI', icon: <Cpu className="w-6 h-6" /> },
  { name: 'OpenAI', icon: <Brain className="w-6 h-6" /> },
  { name: 'NVIDIA', icon: <Zap className="w-6 h-6" /> },
  { name: 'Meta', icon: <Users className="w-6 h-6" /> },
  { name: 'AWS', icon: <Database className="w-6 h-6" /> },
];
// Explicitly import types to provide strict typing for mock data
import { Classroom, Student, Quiz } from './types';

export const PRINCIPLES = [
  {
    title: "Authenticity",
    description: "Proctoring redefined through cognitive verification paths.",
    icon: <Shield className="w-6 h-6 text-indigo-400" />
  },
  {
    title: "Bias-Free",
    description: "Evaluations focused on logic flows rather than keyword matching.",
    icon: <Cpu className="w-6 h-6 text-purple-400" />
  },
  {
    title: "Clarity Over Guessing",
    description: "Verifying why an answer is correct, not just that it is.",
    icon: <Zap className="w-6 h-6 text-amber-400" />
  },
  {
    title: "Progressive Growth",
    description: "Longitudinal analysis of cognitive velocity over time.",
    icon: <Globe className="w-6 h-6 text-emerald-400" />
  }
];

export const PORTALS = [
  {
    id: 'school',
    name: 'School Portal',
    description: 'Institution-wide management for deans and teachers.',
    icon: <School className="w-10 h-10" />,
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'student',
    name: 'Student Portal',
    description: 'Dynamic assessments and AI-powered learning analysis.',
    icon: <GraduationCap className="w-10 h-10" />,
    color: 'from-purple-600 to-pink-700'
  },
  {
    id: 'individual',
    name: 'Individual Portal',
    description: 'Self-paced cognitive growth for professionals.',
    icon: <User className="w-10 h-10" />,
    color: 'from-emerald-600 to-teal-700'
  }
];

// Apply Classroom interface to ensure property consistency
export const MOCK_CLASSROOMS: Classroom[] = [
  { id: '1', name: 'AP Calculus BC', grade: 'Grade 12', studentCount: 28, activeQuizzes: 2 },
  { id: '2', name: 'World History', grade: 'Grade 10', studentCount: 32, activeQuizzes: 1 },
  { id: '3', name: 'Intro to Python', grade: 'Grade 11', studentCount: 24, activeQuizzes: 4 },
];

// Apply Student interface to ensure 'status' is treated as 'active' | 'pending' union rather than string
export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@edu.com', classroom: 'AP Calculus BC', testsCompleted: 8, totalTests: 10, studentId: 'S-9021', status: 'active' },
  { id: '2', name: 'Sarah Miller', email: 'sarah@edu.com', classroom: 'Intro to Python', testsCompleted: 5, totalTests: 10, studentId: 'S-4832', status: 'active' },
  { id: '3', name: 'Jordan Lee', email: 'jordan@edu.com', classroom: 'World History', testsCompleted: 2, totalTests: 10, studentId: 'S-1120', status: 'pending' },
];

// Apply Quiz interface for strict type checking on status and scores
export const MOCK_QUIZZES: Quiz[] = [
  { id: 'q1', title: 'Derivatives & Integrals', topic: 'Calculus', dueDate: '2023-12-15', status: 'active' },
  { id: 'q2', title: 'Data Types in Python', topic: 'Coding', dueDate: '2023-12-10', status: 'completed', score: 92 },
  { id: 'q3', title: 'French Revolution', topic: 'History', dueDate: '2023-12-20', status: 'active' },
];
