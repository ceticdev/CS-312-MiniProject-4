import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorMessage from '../Layout/ErrorMessage';

const PostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
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

  return (
    <div className="container">
      <h1>New Post</h1>
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
          {loading ? 'Creating...' : 'Create'}
        </button>
        <Link to="/posts" className="btn" style={{ backgroundColor: '#6c757d' }}>Cancel</Link>
      </form>
    </div>
  );
};

export default PostForm;