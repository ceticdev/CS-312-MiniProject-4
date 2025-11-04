import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Account from './components/Auth/Account';
import PostList from './components/Posts/PostList';
import PostView from './components/Posts/PostView';
import PostForm from './components/Posts/PostForm';
import PostEdit from './components/Posts/PostEdit';
import MyProfile from './components/Posts/MyProfile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.authenticated) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/posts" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/posts" />} />
        <Route path="/posts" element={<ProtectedRoute user={user}><PostList user={user} /></ProtectedRoute>} />
        <Route path="/posts/new" element={<ProtectedRoute user={user}><PostForm user={user} /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute user={user}><PostView user={user} /></ProtectedRoute>} />
        <Route path="/posts/:id/edit" element={<ProtectedRoute user={user}><PostEdit user={user} /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute user={user}><Account user={user} setUser={setUser} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><MyProfile user={user} /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/posts" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
