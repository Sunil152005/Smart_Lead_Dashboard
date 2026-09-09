import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    name?: string;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Access Denied: No authentication token provided.",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const secret = process.env.JWT_SECRET || "mysecret";
    const decoded = jwt.verify(token, secret) as any;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      message: "Authentication Failed: Invalid or expired token.",
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role || "")) {
      return res.status(403).json({
        message: `Forbidden: Only ${roles.join(", ")} can perform this action.`,
      });
    }
    next();
  };
};