import { NextFunction, Request, Response } from "express";
import { extractToken } from "../../infrastructure/authenticators/utils/extract-token";
import { container } from "../../infrastructure/config/dependency-injection";

declare module 'express-serve-static-core' {
    interface Request {
        user?: any
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const credentials = req.headers.authorization // Basic am9obmRvZUBnbWFpbC5jb206cXdlcnR5

        if(!credentials) {
            return res.jsonError("Unauthorized access", 403)
        }

        const token = extractToken(credentials)

        if(!token) {
            return res.jsonError("Unauthorized access", 403)
        }

        const user = await container('authenticator').authenticate(token)

        if(!user) {
            return res.jsonError("Unauthorized access", 403)
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}