CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT
);

CREATE TABLE quiz (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT now(),
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    published BOOLEAN DEFAULT false,
    closed BOOLEAN DEFAULT false,
    userId UUID NOT NULL,
    CONSTRAINT fk_quiz_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_userId ON quiz(userId);

CREATE TABLE question (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    quizId INT NOT NULL,
    question TEXT NOT NULL,
    points INT NOT NULL,
    image TEXT,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quizId) REFERENCES quiz(id) ON DELETE CASCADE
);

CREATE INDEX idx_question_quizId ON question(quizId);

CREATE TABLE options (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    questionId TEXT NOT NULL,
    value TEXT NOT NULL,
    isAnswer BOOLEAN DEFAULT false,
    CONSTRAINT fk_options_question FOREIGN KEY (questionId) REFERENCES question(id) ON DELETE CASCADE
);

CREATE INDEX idx_options_questionId ON options(questionId);

CREATE TABLE submission (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL,
    optionId TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT now(),
    updatedAt TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_submission_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_option FOREIGN KEY (optionId) REFERENCES options(id) ON DELETE CASCADE
);

CREATE INDEX idx_submission_userId ON submission(userId);
CREATE INDEX idx_submission_optionId ON submission(optionId);
