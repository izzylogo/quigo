import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Layout';

import Dashboard from './Individual/Dashboard';
import QuizArchitect from './Individual/QuizArchitect';
import HistoryList from './Individual/HistoryList';
import AttemptDetail from './Individual/AttemptDetail';
import Settings from './Individual/Settings';

const IndividualPortal: React.FC<{ tab: string }> = ({ tab }) => {
  const [selectedAttemptId, setSelectedAttemptId] = React.useState<number | null>(null);

  // Reset drill-down states when switching tabs
  React.useEffect(() => {
    setSelectedAttemptId(null);
  }, [tab]);

  const renderContent = () => {
    switch (tab) {
      case 'dashboard':
        return <Dashboard />;
      case 'generate':
        return <QuizArchitect />;
      case 'history':
        if (selectedAttemptId) {
          // Lazy load or just import AttemptDetail (assuming it's imported)
          // Need to add import at top
          return (
            <AttemptDetail
              attemptId={selectedAttemptId}
              onBack={() => setSelectedAttemptId(null)}
            />
          );
        }
        return <HistoryList onSelectAttempt={setSelectedAttemptId} />;
      case 'settings':
        return <Settings />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-outfit">
      <Sidebar portal="individual" />
      <main className="flex-1 lg:ml-64 p-8 lg:p-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default IndividualPortal;
