import type {Request, Response, NextFunction} from "express";
import {auth} from "../lib/auth";
import {UserRoles} from "../type";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const session = await auth.api.getSession({headers: req.headers});
        const validRoles: UserRoles[] = ["admin", "teacher", "student"];

        if (session) {
            const role = session.user.role;
            if (validRoles.includes(role as UserRoles)) {
                req.user = {
                    role: session.user.role as UserRoles
                }
            }
        }
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        next();
    }
};

export default authMiddleware;