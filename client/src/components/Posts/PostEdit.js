import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ErrorMessage from '../Layout/ErrorMessage';

const PostEdit = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        if (data.post.creator_user_id !== user.id) {
          alert('You are not authorized to edit this post');
          navigate('/posts');
          return;
        }
        setFormData({
          title: data.post.title,
          body: data.post.body
        });
      } else {
        alert(data.message || 'Post not found');
        navigate('/posts');
      }
    } catch (error) {
      alert('Network error occurred');
      navigate('/posts');
    } finally {
      setFetchingPost(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/posts/${id}`);
      } else if (data.authorized === false) {
        alert('You are not authorized to edit this post');
        navigate('/posts');
      } else {
        setErrors(data.errors || [data.message]);
      }
    } catch (error) {
      setErrors(['Network error occurred']);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingPost) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Edit Post</h1>
      <ErrorMessage errors={errors} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength="255"
          />
          <small>Max 255 characters</small>
        </div>
        <div>
          <label htmlFor="body">Content</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            required
            maxLength="5000"
          />
          <small>Max 5000 characters</small>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
        <Link to={`/posts/${id}`} className="btn" style={{ backgroundColor: '#6c757d' }}>Cancel</Link>
      </form>
    </div>
  );
};

export default PostEdit;