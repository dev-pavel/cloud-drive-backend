import {IUserToken} from "../interfaces/interfaces";
import jwt from "jsonwebtoken";

export interface ITokens {
    accessToken: string
    refreshToken: string
}

class TokensService {
    protected accessTokenSecret: string
    protected refreshTokenSecret: string
    private accessTokenExpires: number = 60 * 60
    private refreshTokenExpires: number = 30 * 24 * 60 * 60

    constructor(accessTokenSecret?: string, refreshTokenSecret?: string) {
        this.accessTokenSecret = accessTokenSecret || process.env.ACCESS_TOKEN_SECRET || 'access token secret'
        this.refreshTokenSecret = refreshTokenSecret || process.env.ACCESS_TOKEN_SECRET || 'refresh token secret'
    }

    generateTokens = (userData: IUserToken): ITokens => {
        const accessToken = jwt.sign(userData, this.accessTokenSecret, {expiresIn: this.accessTokenExpires});
        const refreshToken = jwt.sign(userData, this.refreshTokenSecret, {expiresIn: this.refreshTokenExpires});

        return {
            accessToken,
            refreshToken
        }
    }

    checkTokenValid = (token: string, type: 'access' | 'refresh'): boolean => {
        try {
            if (type === 'access') {
                jwt.verify(token, this.accessTokenSecret);
                return true
            } else if (type === 'refresh') {
                jwt.verify(token, this.refreshTokenSecret);
                return true
            }

            return false
        } catch (e) {
            return false
        }
    }

    decodeToken = (token: string): IUserToken => {
        return jwt.decode(token) as IUserToken
    }
}

export default TokensService