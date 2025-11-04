import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const MyProfile = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/user/${user.id}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      } else {
        setError(data.message || 'Failed to load your posts');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setPosts(posts.filter(post => post.blog_id !== postId));
      } else {
        alert(data.message || 'Failed to delete post');
      }
    } catch (error) {
      alert('Network error occurred');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h1>My Profile</h1>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Total Posts:</strong> {posts.length}</p>
      </div>
      
      <h2>My Posts</h2>
      {posts.length === 0 ? (
        <p>You haven't created any posts yet. <Link to="/posts/new">Create your first post!</Link></p>
      ) : (
        posts.map(post => (
          <article key={post.blog_id}>
            <h3>{post.title}</h3>
            <small>Created on {new Date(post.date_created).toLocaleDateString()}</small>
            <p>{post.body.substring(0, 100)}...</p>
            <Link to={`/posts/${post.blog_id}`} className="btn">View</Link>
            <Link to={`/posts/${post.blog_id}/edit`} className="btn">Edit</Link>
            <button 
              onClick={() => handleDelete(post.blog_id)} 
              className="btn btn-danger"
            >
              Delete
            </button>
          </article>
        ))
      )}
    </div>
  );
};

export default MyProfile;