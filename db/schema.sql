CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT
);

CREATE TABLE quiz (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    password TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    closed BOOLEAN DEFAULT FALSE,
    userId CHAR(36) NOT NULL,
    CONSTRAINT fk_quiz_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_userId ON quiz(userId);

CREATE TABLE question (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quizId INT NOT NULL,
    question TEXT NOT NULL,
    points INT NOT NULL,
    `order` INT NOT NULL, -- 'order' is a reserved keyword, so use backticks
    image TEXT,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quizId) REFERENCES quiz(id) ON DELETE CASCADE
);

CREATE INDEX idx_question_quizId ON question(quizId);

CREATE TABLE options (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    questionId CHAR(36) NOT NULL,
    value TEXT NOT NULL,
    isAnswer BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_options_question FOREIGN KEY (questionId) REFERENCES question(id) ON DELETE CASCADE
);

CREATE INDEX idx_options_questionId ON options(questionId);

CREATE TABLE submission (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId CHAR(36) NOT NULL,
    quizId INT NOT NULL,
    optionId CHAR(36) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_submission_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_quiz FOREIGN KEY (quizId) REFERENCES quiz(id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_option FOREIGN KEY (optionId) REFERENCES options(id) ON DELETE CASCADE
);

CREATE INDEX idx_submission_userId ON submission(userId);
CREATE INDEX idx_submission_quizId ON submission(quizId);
CREATE INDEX idx_submission_optionId ON submission(optionId);
