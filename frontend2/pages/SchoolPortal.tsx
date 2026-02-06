import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Layout';
import { schoolService } from '../services/api';
import { Classroom, Student } from '../types';

import DashboardOverview from './School/DashboardOverview';
import ClassroomDetail from './School/ClassroomDetail';
import StudentList from './School/StudentList';
import StudentDetail from './School/StudentDetail';
import Analytics from './School/Analytics';
import Settings from './School/Settings';
import CreateClassroomModal from './School/CreateClassroomModal';
import AddStudentModal from './School/AddStudentModal';

const SchoolPortal: React.FC<{ tab: string }> = ({ tab }) => {
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({ classrooms: 0, students: 0, quizzes: 0, completion: '0%' });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab]);

  // Reset drill-down states when switching tabs
  useEffect(() => {
    setSelectedClassroom(null);
    setSelectedStudent(null);
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'classrooms' || tab === 'analytics') {
        const [dash, classes, prof] = await Promise.all([
          schoolService.getDashboard(),
          schoolService.getClassrooms(),
          schoolService.getProfile()
        ]);
        setStats({
          classrooms: dash.statistics.total_classrooms,
          students: dash.statistics.total_students,
          quizzes: dash.statistics.total_quizzes || 0,
          completion: dash.statistics.completion_rate
        });
        setClassrooms(classes);
        setProfile(prof);
      }
      if (tab === 'students') {
        const [allStudents, prof, classes] = await Promise.all([
          schoolService.getStudents(),
          schoolService.getProfile(),
          schoolService.getClassrooms()
        ]);
        setStudents(allStudents);
        setProfile(prof);
        setClassrooms(classes);
      }
      if (tab === 'settings') {
        const prof = await schoolService.getProfile();
        setProfile(prof);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await schoolService.deleteStudent(studentId);
      fetchData();
    } catch (err) {
      alert("Failed to delete student");
      throw err; // Re-throw so StudentList can handle it if needed
    }
  };

  const renderContent = () => {
    if (tab === 'classrooms') {
      if (selectedStudent) {
        return <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
      }
      if (selectedClassroom) {
        return (
          <ClassroomDetail
            classroom={selectedClassroom}
            onBack={() => setSelectedClassroom(null)}
            onSelectStudent={setSelectedStudent}
          />
        );
      }
      return (
        <DashboardOverview
          profile={profile}
          stats={stats}
          classrooms={classrooms}
          loading={loading}
          onOpenCreateModal={() => setShowCreateModal(true)}
          onSelectClassroom={setSelectedClassroom}
        />
      );
    }

    if (tab === 'students') {
      if (selectedStudent) {
        return <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
      }
      return (
        <StudentList
          students={students}
          onSelectStudent={setSelectedStudent}
          onDeleteStudent={handleDeleteStudent}
          onOpenAddModal={() => setShowAddStudentModal(true)}
        />
      );
    }

    if (tab === 'analytics') return <Analytics />;

    if (tab === 'settings') return <Settings profile={profile} />;

    return null;
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-outfit">
      <Sidebar portal="school" />
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + (selectedClassroom?.id || '') + (selectedStudent?.id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <CreateClassroomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchData}
        educationSystems={profile?.education_system || []}
      />

      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onSuccess={fetchData}
        classrooms={classrooms}
      />
    </div>
  );
};

export default SchoolPortal;
