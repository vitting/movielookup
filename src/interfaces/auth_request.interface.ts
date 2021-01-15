import { Request } from "express"

interface Auth {
    id: string;
    name: string;
    iat: number;
    exp: number;
}

export interface AuthRequest extends Request {
  auth: Auth;
}