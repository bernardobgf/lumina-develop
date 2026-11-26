import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import IslandMenu from './components/IslandMenu.jsx';
import ChatPage from './pages/ChatPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ExercisesPage from './pages/ExercisesPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import { authService } from './services/api.js';

export default function App() {
  const [page, setPage] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lumina_user') || 'null'); } catch { return null; }
  });
  const [notice, setNotice] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const notifyError = (message) => setNotice({ type: 'error', message });
  const notifySuccess = (message) => setNotice({ type: 'success', message });

  useEffect(() => {
    const expired = () => { setUser(null); setPage('auth'); setAuthMode('login'); setAuthError('Sua sessão expirou. Entre novamente.'); };
    window.addEventListener('lumina:session-expired', expired);
    return () => window.removeEventListener('lumina:session-expired', expired);
  }, []);

  const handleAuth = async (credentials, mode) => {
    setAuthLoading(true); setAuthError('');
    try {
      const session = mode === 'register' ? await authService.register(credentials) : await authService.login(credentials);
      localStorage.setItem('lumina_token', session.token);
      localStorage.setItem('lumina_user', JSON.stringify(session.user));
      setUser(session.user); setPage('chat'); setNotice({ type: 'success', message: mode === 'register' ? 'Conta criada. Boas-vindas à Lumina!' : 'Login realizado com sucesso.' });
    } catch (error) { setAuthError(error.message); }
    finally { setAuthLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('lumina_token'); localStorage.removeItem('lumina_user');
    setUser(null); setPage('landing'); setNotice({ type: 'success', message: 'Você saiu da sua conta.' });
  };

  return <div className="app-shell">
    {page === 'landing' && <LandingPage onStart={(mode = 'login') => { setAuthMode(mode); setAuthError(''); setPage('auth'); }}/>}
    {page === 'auth' && <AuthPage initialMode={authMode} onSubmit={handleAuth} onBack={() => setPage('landing')} error={authError} loading={authLoading}/>}
    {!['landing', 'auth'].includes(page) && user && <><IslandMenu page={page} user={user} onLogout={logout} onNavigate={setPage}/>{page === 'chat' && <ChatPage onError={notifyError} onSuccess={notifySuccess}/>}{page === 'dashboard' && <DashboardPage/>}{page === 'exercises' && <ExercisesPage onError={notifyError}/>}{page === 'settings' && <SettingsPage user={user}/>}</>}
    {notice && <div className={`toast toast--${notice.type}`} role="status">{notice.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}<span>{notice.message}</span><button onClick={() => setNotice(null)} aria-label="Fechar aviso"><X size={16}/></button></div>}
  </div>;
}
