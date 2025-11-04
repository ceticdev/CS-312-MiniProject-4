DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE blogs (
    blog_id SERIAL PRIMARY KEY,
    creator_name VARCHAR(255) NOT NULL,
    creator_user_id VARCHAR(255) REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL
);

-- insert test users with bcrypt passwords (hash of 'password123')
-- to test: use user_id 'user1', 'user2', or 'user3' 
-- with password 'password123'
INSERT INTO users (user_id, password, name) VALUES
('user1', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86AGR0Ij1im', 'Alice'),
('user2', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86AGR0Ij1im', 'Bob'),
('user3', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86AGR0Ij1im', 'Charlie');

-- insert test blog posts
INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created) VALUES
('Alice', 'user1', 'First Post', 'This is the body of the first post.', '2025-10-13 10:00:00'),
('Bob', 'user2', 'Second Post', 'This is the body of the second post.', '2025-10-13 11:00:00'),
('Alice', 'user1', 'Third Post', 'This is the body of the third post.', '2025-10-13 12:00:00'),
('Charlie', 'user3', 'Fourth Post', 'This is the body of the fourth post.', '2025-10-13 13:00:00'),
('Bob', 'user2', 'Fifth Post', 'This is the body of the fifth post.', '2025-10-13 14:00:00');