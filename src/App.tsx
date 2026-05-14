import { useEffect } from 'react';
import { useTaskStore } from './store/useTaskStore';
import MainLayout from './components/layout/MainLayout';
import BubbleBackground from './components/backgrounds/BubbleBackground';
import HexagonBackground from './components/backgrounds/HexagonBackground';
import ComingSoon from './components/ui/ComingSoon';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AnalyticsPage from './pages/AnalyticsPage';
import MyTasks from './pages/MyTasksPage';
import Dashboard from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { isDarkMode } = useTaskStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      {isDarkMode ? <HexagonBackground /> : <BubbleBackground />}
      
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/analytics" element={<AnalyticsPage />} />         
          <Route path="/team" element={<ComingSoon title="Team" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;