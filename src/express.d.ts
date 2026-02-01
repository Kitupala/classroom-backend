declare global {
    namespace Express {
        interface Request {
            user?: {
                role?: 'teacher' | 'student' | 'admin'
            };
        }
    }
}

export {};