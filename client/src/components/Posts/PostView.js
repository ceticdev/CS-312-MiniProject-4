import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const PostView = ({ user }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setPost(data.post);
      } else {
        setError(data.message || 'Post not found');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        navigate('/posts');
      } else {
        alert(data.message || 'Failed to delete post');
      }
    } catch (error) {
      alert('Network error occurred');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!post) return <div className="container">Post not found</div>;

  return (
    <div className="container">
      <header>
        <h1>{post.title}</h1>
        <small>
          By {post.creator_name} on {new Date(post.date_created).toLocaleDateString()}
        </small>
      </header>
      <main>
        <article>
          <p>{post.body}</p>
        </article>
        <Link to="/posts" className="btn">Back to Posts</Link>
        {user && user.id === post.creator_user_id && (
          <>
            <Link to={`/posts/${post.blog_id}/edit`} className="btn">Edit</Link>
            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          </>
        )}
      </main>
    </div>
  );
};

export default PostView;