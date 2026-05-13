import { useEffect } from 'react';
import { useTaskStore } from './store/useTaskStore';
import MainLayout from './components/layout/MainLayout';
import KanbanBoard from './components/dashboard/KanbanBoard';
import BubbleBackground from './components/backgrounds/BubbleBackground';
import HexagonBackground from './components/backgrounds/HexagonBackground';
import ComingSoon from './components/ui/ComingSoon';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
          <Route path="/" element={<KanbanBoard mode="all" />} />
          <Route path="/my-tasks" element={<KanbanBoard mode="my-tasks" />} />
          <Route path="/analytics" element={<ComingSoon title="Analytics Dashboard" />} />         
          <Route path="/team" element={<ComingSoon title="Team" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
          {/* แปะไว้ ไว้ทำ 404  */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;