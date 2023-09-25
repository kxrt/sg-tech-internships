-- Create a table for internships
CREATE TABLE IF NOT EXISTS internships (
    internship_id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    date_added DATE NOT NULL,
    is_summer BOOLEAN NOT NULL,
);

-- Create a table for users
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL
);

-- Create a table for applications
CREATE TABLE IF NOT EXISTS applications (
    application_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    internship_id INT REFERENCES internships(internship_id),
    status VARCHAR(255) NOT NULL
);