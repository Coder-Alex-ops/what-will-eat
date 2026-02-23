import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { translate } from './i18n';
import { AuthProvider, useAuth } from './services/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import MealsList from './pages/MealsList';
import AddMeal from './pages/AddMeal';
import History from './pages/History';

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('we_eating_lang');
    return (saved as Language) || 'bg';
  });
  
  const [activeTab, setActiveTab] = useState('home');
  const [editingMealId, setEditingMealId] = useState<string | undefined>(undefined);

  const t = (key: string) => translate(key, lang);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'bg' : 'en';
    setLang(newLang);
    localStorage.setItem('we_eating_lang', newLang);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home lang={lang} />;
      case 'meals':
        return <MealsList lang={lang} onEdit={(id) => {
          setEditingMealId(id);
          setActiveTab('addMeal');
        }} />;
      case 'addMeal':
        return <AddMeal 
          lang={lang} 
          editId={editingMealId}
          onSuccess={() => {
            setActiveTab('meals');
            setEditingMealId(undefined);
          }} 
          onCancel={() => {
            setActiveTab('meals');
            setEditingMealId(undefined);
          }}
        />;
      case 'history':
        return <History lang={lang} />;
      default:
        return <Home lang={lang} />;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Not logged in - show login page
  if (!user) {
    return <Login lang={lang} onToggleLang={toggleLang} />;
  }

  // Logged in - show main app
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pt-16 max-w-lg mx-auto bg-gray-50 shadow-xl overflow-hidden min-w-[320px]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 w-full max-w-lg z-20 shadow-sm px-4 h-16 flex items-center justify-between">
        <h1 className="text-lg font-black text-orange-600 tracking-tighter uppercase">{t('apptitle')}</h1>
        <div className="flex items-center space-x-2">
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border-2 border-orange-200 cursor-pointer"
              onClick={logout}
              title={t('logout')}
            />
          )}
          <button 
            onClick={toggleLang}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-1.5 px-3 rounded-lg text-xs transition-colors border border-gray-200"
          >
            {lang === 'en' ? 'BG' : 'EN'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-16 px-4 py-6 w-full">
        {renderPage()}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-lg mx-auto bg-white border-t border-gray-200 z-20 flex justify-around items-center h-16 px-2">
        <NavButton 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')}
          label={t('home')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
        />
        <NavButton 
          active={activeTab === 'meals'} 
          onClick={() => setActiveTab('meals')}
          label={t('meals')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
        />
        <NavButton 
          active={activeTab === 'addMeal'} 
          onClick={() => setActiveTab('addMeal')}
          label={t('addMeal')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
        />
        <NavButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
          label={t('history')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-0.5 flex-1 transition-colors ${active ? 'text-orange-600' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase">{label}</span>
  </button>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
