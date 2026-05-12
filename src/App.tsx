import MainLayout from './components/layout/MainLayout';
import { useEffect } from 'react';
import { useTaskStore } from './store/useTaskStore';

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
    <MainLayout>
      {/* ตอนนี้เราจำลองเนื้อหา Dashboard ไปก่อน เดี๋ยวสเต็ปหน้าเรามาทำ Task Card ใส่ตรงนี้ครับ */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl h-full flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-400 dark:text-gray-500">
          Main Content Area (Dashboard)
        </h2>
      </div>
    </MainLayout>
  );
}

export default App;