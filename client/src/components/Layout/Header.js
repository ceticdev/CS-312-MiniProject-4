import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setUser(null);
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header>
      <h1>My Blog</h1>
      <nav>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <Link to="/posts" className="btn">Posts</Link>
            <Link to="/profile" className="btn">My Profile</Link>
            <Link to="/account" className="btn">Account</Link>
            <button onClick={handleLogout} className="btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;