import jwt from 'jsonwebtoken';
import { config } from "../../config/config.ts";

interface User {
    id: string;
    email: string;
    password: string;
}

export const generateAccessToken = (user: Pick<User, "id">) => {
    return jwt.sign({ id: user.id }, config.JWT_SECRET!, {
        expiresIn: "1d",
    })
}

export const generateRefreshToken = (user: Pick<User, "id">) => {
    return jwt.sign({ id: user.id }, config.JWT_REFRESH_SECRET!, {
        expiresIn: "7d",
    })
}


