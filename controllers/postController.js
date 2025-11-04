// import database connection pool
const pool = require('../config/db');

// middleware checks if user is authenticated
// returns 401 Unauthorized if not
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.status(401).json({ success: false, message: 'Unauthorized' });
};

// validates post title and body against length requirements
const validatePost = (title, body) => {
    const errors = [];
    
    // trim whitespace before validation
    const trimmedTitle = title ? title.trim() : '';
    const trimmedBody = body ? body.trim() : '';
    
    if (trimmedTitle.length === 0) {
        errors.push('Title is required');
    } else if (trimmedTitle.length > 255) {
        errors.push('Title must be 255 characters or less');
    }
    
    if (trimmedBody.length === 0) {
        errors.push('Content is required');
    } else if (trimmedBody.length > 5000) {
        errors.push('Content must be 5000 characters or less');
    }
    
    return errors;
};

// fetches all blog posts from database, returns as JSON
const getAllPosts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blogs ORDER BY date_created DESC');
        res.json({ success: true, posts: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to load posts' });
    }
};

// fetches and returns single post by ID as JSON
const getPostById = async (req, res) => {
    const { id } = req.params;
    
    if (!Number.isInteger(Number(id)) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    
    try {
        const result = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.json({ success: true, post: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to load post' });
    }
};

// creates new blog post, inserts into database, returns as JSON
const createPost = async (req, res) => {
    const { title, body } = req.body;
    const creator_user_id = req.session.user.id;
    const creator_name = req.session.user.name;
    const date_created = new Date();

    const errors = validatePost(title, body);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    try {
        const result = await pool.query(
            'INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [creator_name, creator_user_id, title.trim(), body.trim(), date_created]
        );
        res.status(201).json({ success: true, post: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to create post' });
    }
};

// updates existing blog post with new title and body content
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;
    
    if (!Number.isInteger(Number(id)) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    
    const errors = validatePost(title, body);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }
    
    try {
        const result = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        
        if (result.rows[0].creator_user_id !== req.session.user.id) {
            return res.status(403).json({ success: false, authorized: false, message: 'Unauthorized' });
        }
        
        const updatedResult = await pool.query('UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3 RETURNING *', 
            [title.trim(), body.trim(), id]);
        res.json({ success: true, post: updatedResult.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to update post' });
    }
};

// deletes blog post after verifying user ownership
const deletePost = async (req, res) => {
    const { id } = req.params;
    
    if (!Number.isInteger(Number(id)) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    
    try {
        const result = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        
        if (result.rows[0].creator_user_id !== req.session.user.id) {
            return res.status(403).json({ success: false, authorized: false, message: 'Unauthorized' });
        }
        
        await pool.query('DELETE FROM blogs WHERE blog_id = $1', [id]);
        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to delete post' });
    }
};

// fetches all posts by a specific user
const getPostsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM blogs WHERE creator_user_id = $1 ORDER BY date_created DESC', [userId]);
        res.json({ success: true, posts: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to load posts' });
    }
};

module.exports = {
    isAuthenticated,
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getPostsByUser
};