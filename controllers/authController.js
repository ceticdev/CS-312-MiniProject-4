// import database and bcrypt for password hashing
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// handles signup form submission, creates new user account
const signup = async (req, res) => {
    const { name, user_id, password } = req.body;

    if (!name || !user_id || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // prevent duplicate user_ids
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id.trim()]);
        if (user.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'User ID already exists' });
        }

        // bcrypt hashes and salts password
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const result = await pool.query('INSERT INTO users (name, user_id, password) VALUES ($1, $2, $3) RETURNING user_id', 
            [name.trim(), user_id.trim(), hashedPassword]);

        res.status(201).json({ success: true, message: 'User created successfully', userId: result.rows[0].user_id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error during signup' });
    }
};

// handles login form submission, authenticates user
const login = async (req, res) => {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
        return res.status(400).json({ success: false, message: 'User ID and password are required' });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id.trim()]);
        if (user.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // verifies submitted password against hashed password in database
        const isValidPassword = await bcrypt.compare(password.trim(), user.rows[0].password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // stores user info in session after successful authentication
        req.session.user = {
            id: user.rows[0].user_id,
            name: user.rows[0].name
        };

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: { id: user.rows[0].user_id, name: user.rows[0].name }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// handles user logout, destroys session
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Logout successful' });
    });
};

// checks current session status
const getSession = (req, res) => {
    if (req.session.user) {
        res.json({
            authenticated: true,
            user: req.session.user
        });
    } else {
        res.json({
            authenticated: false
        });
    }
};

// handles account updates, including user_id and/or password changes
const updateAccount = async (req, res) => {
    const { user_id, password } = req.body;
    const old_user_id = req.session.user.id;

    try {
        // validates user_id not empty
        if (!user_id || user_id.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        let hashedPassword;
        // only hashes password if user provides new one
        if (password && password.trim().length > 0) {
            hashedPassword = await bcrypt.hash(password.trim(), 10);
        }

        // updates user_id and password if both provided
        if (user_id.trim() !== old_user_id && hashedPassword) {
            await pool.query(
                'UPDATE users SET user_id = $1, password = $2 WHERE user_id = $3',
                [user_id.trim(), hashedPassword, old_user_id]
            );
        } 
        // updates only user_id if changed and password not provided
        else if (user_id.trim() !== old_user_id) {
            await pool.query(
                'UPDATE users SET user_id = $1 WHERE user_id = $2',
                [user_id.trim(), old_user_id]
            );
        } 
        // updates only password if user_id not changed but password provided
        else if (hashedPassword) {
            await pool.query(
                'UPDATE users SET password = $1 WHERE user_id = $2',
                [hashedPassword, old_user_id]
            );
        }

        // updates session with new user_id after successful database update
        const updatedUser = await pool.query('SELECT user_id, name FROM users WHERE user_id = $1', [user_id.trim()]);
        req.session.user = {
            id: updatedUser.rows[0].user_id,
            name: updatedUser.rows[0].name
        };
        
        res.json({
            success: true,
            message: 'Account updated successfully',
            user: req.session.user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error updating account' });
    }
};


module.exports = {
    signup,
    login,
    logout,
    getSession,
    updateAccount
};