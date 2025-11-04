import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const PostList = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      } else {
        setError(data.message || 'Failed to load posts');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
      <main>
        <Link to="/posts/new" className="btn">New Post</Link>
        {posts.length === 0 ? (
          <p>No posts yet. Create your first post!</p>
        ) : (
          posts.map(post => (
            <article key={post.blog_id}>
              <h2>{post.title}</h2>
              <small>
                By {post.creator_name} on {new Date(post.date_created).toLocaleDateString()}
              </small>
              <p>{post.body.substring(0, 100)}...</p>
              <Link to={`/posts/${post.blog_id}`} className="btn">Read More</Link>
              {user && user.id === post.creator_user_id && (
                <>
                  <Link to={`/posts/${post.blog_id}/edit`} className="btn">Edit</Link>
                  <button 
                    onClick={() => handleDelete(post.blog_id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </>
              )}
            </article>
          ))
        )}
      </main>
    </div>
  );
};

export default PostList;