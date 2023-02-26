import {Request, Response, NextFunction} from "express";
import TokensService from "../services/tokens.service";

class JWTGuard {
    tokenService: TokensService;
    constructor() {
        this.tokenService = new TokensService();
    }

    checkJWT = (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessJWT = req.headers.authorization;

            if (accessJWT) {
                const isTokenValid = this.tokenService.checkTokenValid(accessJWT, 'access');

                if (isTokenValid) {
                    next()
                } else {
                    res.status(401).send({success: false, error: 'access token expired'});
                }
            } else {
                throw new Error('access token not provided');
            }
        } catch (e) {
            res.status(500).send({success: false, error: e});
        }
    }
}

export default JWTGuard