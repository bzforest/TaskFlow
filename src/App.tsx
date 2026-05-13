import { useEffect } from 'react';
import { useTaskStore } from './store/useTaskStore';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import BubbleBackground from './components/backgrounds/BubbleBackground';
import HexagonBackground from './components/backgrounds/HexagonBackground';

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
    <>
      {isDarkMode ? <HexagonBackground /> : <BubbleBackground />}
      
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </>
  );
}

export default App;