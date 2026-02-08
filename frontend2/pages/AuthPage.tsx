import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Loader2, Zap, AlertCircle, Globe, Database, ChevronDown } from 'lucide-react';
import { PortalType } from '../types';
import { authService } from '../services/api';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialPortal = (location.state as any)?.portal || 'student';
  const [portal, setPortal] = useState<PortalType>(initialPortal);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [country, setCountry] = useState('');
  const [educationSystems, setEducationSystems] = useState<{ countries: string[], systems: any } | null>(null);
  const [loadingSystems, setLoadingSystems] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedSchoolTab, setSelectedSchoolTab] = useState(0);
  const [selectedClassroomTab, setSelectedClassroomTab] = useState(0);

  useEffect(() => {
    if (!isLogin && (portal === 'school' || portal === 'individual')) {
      fetchSystems();
    }
  }, [isLogin, portal]);

  const fetchSystems = async () => {
    setLoadingSystems(true);
    try {
      const data = await authService.getEducationSystems();
      setEducationSystems(data);
    } catch (err) {
      console.error("Failed to fetch systems", err);
    } finally {
      setLoadingSystems(false);
    }
  };

  const handlePreregisteredLogin = async () => {
    setLoadingSchools(true);
    setShowSchoolModal(true);
    try {
      const data = await authService.getSchools();
      setSchools(data);
    } catch (err) {
      console.error("Failed to fetch schools", err);
    } finally {
      setLoadingSchools(false);
    }
  };

  const selectSchool = async (school: any) => {
    setEmail(school.email);
    setPassword('password123');
    setShowSchoolModal(false);

    // Auto-login after state update
    setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await authService.loginSchool({
          email: school.email,
          password: 'password123'
        });
        const token = response.access_token;
        localStorage.setItem('quigo_token', token);
        localStorage.setItem('quigo_role', 'school');
        navigate('/school/classrooms');
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Quick login failed.');
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const handlePreregisteredStudentLogin = async () => {
    setLoadingStudents(true);
    setShowStudentModal(true);
    try {
      const data = await authService.getStudentsList();
      setStudentsData(data);
      if (data.length > 0) {
        setSelectedSchoolTab(0);
        setSelectedClassroomTab(0);
      }
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const selectStudent = async (student: any) => {
    setEmail(student.student_id);
    setPassword(student.password);
    setShowStudentModal(false);

    // Auto-login after state update
    setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await authService.loginStudent({
          student_id: student.student_id,
          password: student.password
        });
        const token = response.access_token || response.token;
        localStorage.setItem('quigo_token', token);
        localStorage.setItem('quigo_role', 'student');
        navigate('/student/assessments');
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Quick login failed.');
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        let response;
        if (portal === 'school') {
          response = await authService.loginSchool({ email, password });
        } else if (portal === 'student') {
          // Assuming Student ID is entered in the "Email" field in this simplified UI
          response = await authService.loginStudent({ student_id: email, password });
        } else {
          // Individual login
          response = await authService.loginIndividual({ email, password });
        }

        const token = response.access_token || response.token;
        if (!token) {
          console.error("Auth response missing token:", response);
          throw new Error("Authentication succeeded but no token was returned. Please try again.");
        }
        localStorage.setItem('quigo_token', token);
        localStorage.setItem('quigo_role', portal);
        navigate(`/${portal}/${portal === 'school' ? 'classrooms' : portal === 'student' ? 'assessments' : 'dashboard'}`);
      } else {
        if (portal === 'school' || portal === 'individual') {
          if (portal === 'school' && !country) {
            setError('Please select your global region.');
            setLoading(false);
            return;
          }
          if (portal === 'school') {
            await authService.registerSchool({ name, email, password, country });
          } else {
            await authService.registerIndividual({ name, email, password });
          }
          setIsLogin(true);
          setError('Account created successfully! Please sign in.');
        } else {
          setError('Students must be invited by their institution. Self-registration is only for Schools & Individuals.');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-outfit relative">
      <button
        onClick={() => navigate('/')}
        className="lg:hidden absolute top-6 left-6 z-10 flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-all font-semibold"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Home</span>
      </button>
      {/* Left Decoration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#f9fafb] relative overflow-hidden items-center justify-center p-24 border-r border-slate-100">
        <div className="absolute inset-0 grid-pattern opacity-[0.4]" />
        <div className="relative z-10 space-y-12 max-w-lg">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-all font-semibold">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Home</span>
          </button>
          <div className="space-y-8">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
              <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] tracking-tight">The Best Way to Learn.</h1>
            <p className="text-slate-500 text-xl leading-relaxed font-medium">Join schools and students around the world using QuiGo to grow faster.</p>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-24 bg-white relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8 md:space-y-12 pt-12 lg:pt-0">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="hidden sm:block text-slate-400 font-medium">Log in to your account</p>
          </div>

          <div className="flex p-1 bg-slate-50 rounded-full border border-slate-100 shadow-inner overflow-x-auto no-scrollbar">
            {(['school', 'student', 'individual'] as PortalType[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPortal(p);
                  if (p === 'student') setIsLogin(true);
                }}
                className={`flex-1 py-3 sm:py-4 px-2 rounded-full transition-all font-display font-bold text-[9px] sm:text-[10px] uppercase tracking-widest whitespace-nowrap ${portal === p ? 'bg-white text-blue-600 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {p === 'school' ? 'School' : p === 'student' ? 'Student' : 'Individual'}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-8">
            {error && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${error.includes('successfully') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            <div className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest">
                    {portal === 'school' ? 'Institution Name' : 'Full Name'}
                  </label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl py-4 sm:py-6 pl-14 pr-6 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 shadow-inner-sm outline-none transition-all text-slate-900 font-semibold"
                    />
                  </div>
                </div>
              )}

              {portal === 'school' && !isLogin && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest">Global Region</label>
                    <div className="relative group">
                      <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                      <select
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl py-6 pl-14 pr-12 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 shadow-inner-sm outline-none transition-all text-slate-900 font-semibold appearance-none cursor-pointer"
                      >
                        <option value="" disabled>{loadingSystems ? 'Loading regions...' : 'Select Region'}</option>
                        {educationSystems?.countries.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                    {error.includes('region') && <p className="text-[10px] text-red-500 font-bold ml-4 mt-1">Region is required for curriculum sync.</p>}
                  </div>

                  {country && educationSystems?.systems[country] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100/50 rounded-xl flex items-center justify-center text-blue-600">
                          <Database size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Curriculum Sync</p>
                          <p className="text-sm font-bold text-slate-900">{country} Standards</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {educationSystems.systems[country].levels.map((level: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-500 shadow-sm uppercase tracking-tight">
                            {level}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest">
                  {portal === 'student' ? 'Student ID' : 'Email Address'}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type={portal === 'student' ? 'text' : 'email'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={portal === 'student' ? 'S-XXXX' : 'name@example.com'}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl py-6 pl-14 pr-6 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 shadow-inner-sm outline-none transition-all text-slate-900 font-semibold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  {isLogin && <button className="text-[10px] text-blue-600 font-black uppercase tracking-widest hover:underline">Forgot?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl py-6 pl-14 pr-6 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 shadow-inner-sm outline-none transition-all text-slate-900 font-semibold tracking-widest"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-display font-bold text-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-3">
              {loading ? <Loader2 className="animate-spin" /> : <span>{isLogin ? 'Sign In' : 'Create Account'}</span>}
            </button>

            {portal === 'school' && isLogin && (
              <button
                type="button"
                onClick={handlePreregisteredLogin}
                className="w-full bg-slate-50 text-slate-600 py-4 rounded-3xl font-display font-bold text-sm hover:bg-slate-100 transition-all border border-slate-200 flex items-center justify-center space-x-2"
              >
                <Database size={16} />
                <span>Log into preregistered school</span>
              </button>
            )}

            {portal === 'student' && isLogin && (
              <button
                type="button"
                onClick={handlePreregisteredStudentLogin}
                className="w-full bg-slate-50 text-slate-600 py-4 rounded-3xl font-display font-bold text-sm hover:bg-slate-100 transition-all border border-slate-200 flex items-center justify-center space-x-2"
              >
                <Database size={16} />
                <span>View preregistered students</span>
              </button>
            )}
          </form>

          {portal !== 'student' && (
            <p className="text-center text-slate-500 font-medium text-lg pt-4 tracking-tight">
              {isLogin ? "New to QuiGo?" : "Already verified?"}{' '}
              <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline ml-1">
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          )}
        </motion.div>
      </div>

      {/* Preregistered Schools Modal */}
      <AnimatePresence>
        {showSchoolModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSchoolModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-2xl font-display font-bold text-slate-900">Select School</h3>
                  <p className="text-sm text-slate-500 font-medium">Choose a preregistered institution to login</p>
                </div>
                <button onClick={() => setShowSchoolModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all text-slate-400">
                  <ArrowLeft size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                {loadingSchools ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Fetching registered schools...</p>
                  </div>
                ) : schools.length > 0 ? (
                  schools.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => selectSchool(school)}
                      className="w-full group p-6 rounded-3xl bg-slate-50 hover:bg-blue-600 transition-all border border-slate-100 hover:border-blue-500 text-left flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-white transition-colors">{school.name}</p>
                        <p className="text-sm text-slate-400 group-hover:text-blue-100 transition-colors">{school.email}</p>
                      </div>
                      <Zap size={20} className="text-slate-200 group-hover:text-white transition-colors" fill="currentColor" />
                    </button>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-slate-400 font-medium">No preregistered schools found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preregistered Students Modal */}
      <AnimatePresence>
        {showStudentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStudentModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                <div>
                  <h3 className="text-2xl font-display font-bold text-slate-900">Preregistered Students</h3>
                  <p className="text-sm text-slate-500 font-medium">Select a student to quick-login</p>
                </div>
                <button onClick={() => setShowStudentModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all text-slate-400">
                  <ArrowLeft size={20} />
                </button>
              </div>

              {loadingStudents ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Fetching students...</p>
                </div>
              ) : studentsData.length > 0 ? (
                <div className="flex flex-col overflow-hidden flex-1">
                  {/* School Tabs */}
                  <div className="border-b border-slate-100 px-6 pt-4 flex-shrink-0">
                    <div className="flex gap-2 overflow-x-auto">
                      {studentsData.map((school, idx) => (
                        <button
                          key={school.id}
                          onClick={() => {
                            setSelectedSchoolTab(idx);
                            setSelectedClassroomTab(0);
                          }}
                          className={`px-6 py-3 font-bold text-sm rounded-t-2xl transition-all whitespace-nowrap ${selectedSchoolTab === idx
                            ? 'bg-white text-blue-600 border-t-2 border-x-2 border-blue-600'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                          {school.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Classroom Tabs */}
                  {studentsData[selectedSchoolTab]?.classrooms.length > 0 && (
                    <div className="border-b border-slate-100 px-6 py-2 bg-slate-50/30 flex-shrink-0">
                      <div className="flex gap-2 overflow-x-auto">
                        {studentsData[selectedSchoolTab].classrooms.map((classroom: any, idx: number) => (
                          <button
                            key={classroom.id}
                            onClick={() => setSelectedClassroomTab(idx)}
                            className={`px-4 py-2 font-bold text-xs rounded-xl transition-all whitespace-nowrap ${selectedClassroomTab === idx
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-100'
                              }`}
                          >
                            {classroom.name} ({classroom.students.length})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Students List */}
                  <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-3">
                      {studentsData[selectedSchoolTab]?.classrooms[selectedClassroomTab]?.students.map((student: any) => (
                        <button
                          key={student.id}
                          onClick={() => selectStudent(student)}
                          className="w-full group p-5 rounded-2xl bg-slate-50 hover:bg-blue-600 transition-all border border-slate-100 hover:border-blue-500 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 group-hover:text-white transition-colors">{student.name}</p>
                              <div className="flex gap-4 mt-1">
                                <p className="text-sm text-slate-500 group-hover:text-blue-100 transition-colors">
                                  <span className="font-bold">ID:</span> {student.student_id}
                                </p>
                                <p className="text-sm text-slate-500 group-hover:text-blue-100 transition-colors">
                                  <span className="font-bold">Password:</span> {student.password}
                                </p>
                              </div>
                            </div>
                            <Zap size={20} className="text-slate-200 group-hover:text-white transition-colors" fill="currentColor" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-slate-400 font-medium">No preregistered students found.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
