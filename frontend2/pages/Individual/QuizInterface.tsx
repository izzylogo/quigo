import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface QuizInterfaceProps {
    quizId: number;
    onBack: () => void;
}

interface Question {
    id: number;
    text: string;
    options?: any;
    question_type: string;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ quizId, onBack }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [attemptId, setAttemptId] = useState<number | null>(null);
    const [quizTopic, setQuizTopic] = useState('');
    const [quizFormat, setQuizFormat] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        startQuiz();
    }, [quizId]);

    const startQuiz = async () => {
        try {
            const response = await api.post(`/api/individual/quizzes/${quizId}/start`, {});
            setAttemptId(response.data.attempt_id);
            setQuizTopic(response.data.quiz_topic);
            setQuizFormat(response.data.quiz_format);
            setQuestions(response.data.questions);
            if (response.data.time_limit) {
                setTimeLeft(response.data.time_limit * 60);
            }
        } catch (error) {
            console.error('Failed to start quiz:', error);
            alert('Failed to start quiz');
            onBack();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeLeft === null || result) return;

        if (timeLeft <= 0) {
            handleSubmit(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, result]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async (isAuto = false) => {
        if (!isAuto && Object.keys(answers).length < questions.length) {
            if (!window.confirm('You haven\'t answered all questions. Submit anyway?')) return;
        }

        setSubmitting(true);
        try {
            const response = await api.post(`/api/individual/attempts/${attemptId}/submit`, { answers });
            setResult(response.data);
        } catch (error) {
            console.error('Failed to submit quiz:', error);
            alert('Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
            </div>
        );
    }

    if (result) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${result.score_percentage >= 70 ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                        {result.score_percentage >= 70 ? <CheckCircle size={48} className="text-emerald-600" /> : <XCircle size={48} className="text-orange-600" />}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{result.score_percentage}%</h2>
                    <p className="text-slate-500">Score: {result.score}</p>
                </div>

                <div className="space-y-4">
                    {result.feedback.map((item: any, idx: number) => (
                        <div key={idx} className={`bg-white border rounded-2xl p-6 
                            ${item.score >= 1 ? 'border-emerald-200 bg-emerald-50/10' :
                                item.score > 0 ? 'border-orange-200 bg-orange-50/10' :
                                    'border-red-200 bg-red-50/10'}`
                        }>
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                                            ${item.score >= 1 ? 'bg-emerald-100 text-emerald-700' :
                                                item.score > 0 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'}`
                                        }>
                                            {item.score >= 1 ? 'Correct' : item.score > 0 ? 'Partial' : 'Incorrect'}
                                        </span>
                                        {item.score !== undefined && (
                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                                Score: {item.score}/1
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-slate-900 mb-2">Question {idx + 1}</p>
                                    <p className="text-sm text-slate-600 mb-4">{item.feedback}</p>

                                    {(item.user_answer || item.correct_answer) && (
                                        <div className="space-y-1 text-sm bg-white/50 p-3 rounded-xl border border-slate-100">
                                            {item.user_answer && <p className="text-slate-600 flex gap-2"><span className="font-bold w-24">Your answer:</span> {item.user_answer}</p>}
                                            {item.correct_answer && <p className="text-emerald-700 flex gap-2"><span className="font-bold w-24">Correct answer:</span> {item.correct_answer}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={onBack} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">Back to Tests</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{quizTopic}</h1>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-slate-500 font-medium">{questions.length} Questions • <span className="capitalize">{quizFormat.replace('_', ' ')}</span></p>
                        {timeLeft !== null && (
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                <Clock size={14} />
                                <span>{formatTime(timeLeft)} remaining</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {questions.map((question, idx) => (
                    <div key={question.id} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-blue-600/20">
                                {idx + 1}
                            </div>
                            <p className="text-lg font-semibold text-slate-900 flex-1 leading-relaxed">{question.text}</p>
                        </div>

                        {question.question_type === 'multiple_choice' && question.options ? (
                            <div className="space-y-3">
                                {Array.isArray(question.options) ? (
                                    question.options.map((option, optIdx) => (
                                        <label key={optIdx} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${answers[question.id] === option ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answers[question.id] === option ? 'border-blue-600' : 'border-slate-300'}`}>
                                                {answers[question.id] === option && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                            </div>
                                            <input type="radio" name={`question-${question.id}`} value={option} checked={answers[question.id] === option} onChange={(e) => handleAnswerChange(question.id, e.target.value)} className="hidden" />
                                            <span className={`flex-1 font-medium ${answers[question.id] === option ? 'text-blue-900' : 'text-slate-700'}`}>{option}</span>
                                        </label>
                                    ))
                                ) : (
                                    Object.entries(question.options).map(([key, value]) => (
                                        <label key={key} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${answers[question.id] === key ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${answers[question.id] === key ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                {key}
                                            </div>
                                            <input type="radio" name={`question-${question.id}`} value={key} checked={answers[question.id] === key} onChange={(e) => handleAnswerChange(question.id, e.target.value)} className="hidden" />
                                            <span className={`flex-1 font-medium ${answers[question.id] === key ? 'text-blue-900' : 'text-slate-700'}`}>{value as string}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        ) : question.question_type === 'true_false' ? (
                            <div className="flex gap-4">
                                {['True', 'False'].map((option) => (
                                    <label key={option} className={`flex-1 flex items-center justify-center gap-3 p-6 border rounded-2xl cursor-pointer transition-all ${answers[question.id] === option ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                                        <input type="radio" name={`question-${question.id}`} value={option} checked={answers[question.id] === option} onChange={(e) => handleAnswerChange(question.id, e.target.value)} className="hidden" />
                                        <span className="font-bold text-lg">{option}</span>
                                        {answers[question.id] === option && <CheckCircle size={20} className="text-white" />}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea value={answers[question.id] || ''} onChange={(e) => handleAnswerChange(question.id, e.target.value)} placeholder="Type your answer here..." rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none text-slate-700 font-medium placeholder:text-slate-400" />
                        )}
                    </div>
                ))}
            </div>

            <div className="sticky bottom-4">
                <button onClick={handleSubmit} disabled={submitting} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10">
                    {submitting ? <><Loader2 className="animate-spin" size={24} /><span>Submitting...</span></> : <><CheckCircle size={24} /><span>Submit Quiz</span></>}
                </button>
            </div>
        </div>
    );
};

export default QuizInterface;
