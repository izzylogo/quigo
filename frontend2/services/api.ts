
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('quigo_token');
    // Ensure token exists and is a valid string, not 'undefined' or 'null' from previous failed attempts
    if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized access - clearing session and redirecting");

            // Clear all auth related storage
            localStorage.removeItem('quigo_token');
            localStorage.removeItem('quigo_role');
            localStorage.removeItem('quigo_user');

            // Force a redirect to login if we're not already on a public page
            const currentPath = window.location.pathname;
            if (currentPath !== '/auth' && currentPath !== '/' && currentPath !== '/landing') {
                // Use replace to avoid keeping the unauthorized page in history
                window.location.replace('/auth');
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    registerSchool: async (data: any) => {
        const response = await api.post('/api/school/register', data);
        return response.data;
    },
    loginSchool: async (data: any) => {
        const response = await api.post('/api/school/login', data);
        return response.data;
    },
    registerIndividual: async (data: any) => {
        const response = await api.post('/api/individual/register', data);
        return response.data;
    },
    loginIndividual: async (data: any) => {
        const response = await api.post('/api/individual/login', data);
        return response.data;
    },
    loginStudent: async (data: any) => {
        const response = await api.post('/api/student/login', data);
        return response.data;
    },
    getEducationSystems: async () => {
        const response = await api.get('/api/school/education-systems');
        return response.data;
    },
    getSchools: async () => {
        const response = await api.get('/api/school/list');
        return response.data;
    },
};

export const schoolService = {
    getProfile: () => api.get('/api/school/profile').then(res => res.data),
    getDashboard: () => api.get('/api/school/dashboard/overview').then(res => res.data),
    getClassrooms: () => api.get('/api/school/classrooms').then(res => res.data),
    createClassroom: (data: any) => api.post('/api/school/classrooms', data).then(res => res.data),
    getClassroomDetails: (id: any) => api.get(`/api/school/classrooms/${id}`).then(res => res.data),
    getStudents: () => api.get('/api/school/students').then(res => res.data),
    bulkImportStudents: (classroomId: any, data: any) => api.post(`/api/school/classrooms/${classroomId}/students/bulk`, data).then(res => res.data),
    createQuiz: (classroomId: any, formData: FormData) => api.post(`/api/school/classrooms/${classroomId}/quiz`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
    getQuizzes: (classroomId: any) => api.get(`/api/school/classrooms/${classroomId}/quizzes`).then(res => res.data),
    getQuizResults: (quizId: any) => api.get(`/api/school/quizzes/${quizId}/results`).then(res => res.data),
    deleteStudent: (studentId: any) => api.delete(`/api/school/students/${studentId}`).then(res => res.data),
    getStudentAttempts: (studentId: any) => api.get(`/api/school/students/${studentId}/attempts`).then(res => res.data),
    getAnalytics: () => api.get('/api/school/analytics').then(res => res.data),
    getAttemptDetails: (id: any) => api.get(`/api/school/attempts/${id}`).then(res => res.data),
    getDocuments: () => api.get('/api/school/documents').then(res => res.data),
};

export const studentService = {
    getProfile: () => api.get('/api/student/profile').then(res => res.data),
    getQuizzes: () => api.get('/api/student/quizzes').then(res => res.data),
    getQuiz: (id: any) => api.get(`/api/student/quizzes/${id}`).then(res => res.data),
    generateQuizQuestions: (quizId: any, data: any) => api.post(`/api/student/quizzes/${quizId}/generate`, data).then(res => res.data),
    submitQuiz: (quizId: any, data: any) => api.post(`/api/student/quizzes/${quizId}/submit`, data).then(res => res.data),
    getHistory: () => api.get('/api/student/attempts').then(res => res.data),
    getAttemptDetails: (id: any) => api.get(`/api/student/attempts/${id}`).then(res => res.data),
    getAnalysis: () => api.get('/api/student/analysis').then(res => res.data),
};

export const individualService = {
    // Profile
    getProfile: () => api.get('/api/individual/profile').then(res => res.data),
    updateApiKey: (data: any) => api.post('/api/individual/settings', data).then(res => res.data),

    // Dashboard
    getDashboard: () => api.get('/api/individual/dashboard').then(res => res.data),

    // Quizzes
    getQuizzes: () => api.get('/api/individual/quizzes').then(res => res.data),
    createQuiz: (data: FormData | any) => {
        const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        return api.post('/api/individual/quizzes', data, config).then(res => res.data);
    },
    startQuiz: (quizId: number) => api.post(`/api/individual/quizzes/${quizId}/start`, {}).then(res => res.data),

    // Documents
    getDocuments: () => api.get('/api/individual/documents').then(res => res.data),

    // Attempts
    submitAttempt: (attemptId: number, answers: any) => api.post(`/api/individual/attempts/${attemptId}/submit`, { answers }).then(res => res.data),
    getAttempts: () => api.get('/api/individual/attempts').then(res => res.data),
    getAttemptDetails: (attemptId: number) => api.get(`/api/individual/attempts/${attemptId}`).then(res => res.data),
};

export default api;
