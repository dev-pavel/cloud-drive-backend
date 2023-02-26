import {ServiceResponse} from "../interfaces/interfaces";
import User from "../models/User";
import TokensService, {ITokens} from "./tokens.service";
import * as crypto from "crypto";

export interface IRegData {
    email: string
    password: string
    firstName: string
    lastName: string
}

export interface ILoginData {
    email: string,
    password: string
}

class AuthService {
    private tokenService: TokensService

    constructor() {
        this.tokenService = new TokensService()
    }

    private hashPassword(password: string): string {
        return crypto.createHash('sha256').update(password, 'utf8').digest('hex')
    }

    login = async (loginData: ILoginData): Promise<ServiceResponse<ITokens>> => {
        try {
            const user = await User.findOne({email: loginData.email})

            if (user) {
                const passwordHash = this.hashPassword(loginData.password)

                if (passwordHash === user.password) {
                    const tokens = this.tokenService.generateTokens({
                            email: user.email,
                            userId: user._id.toString()
                        }
                    )

                    return {success: true, result: tokens}
                } else {
                    throw new Error('entered an invalid username or password')
                }
            } else {
                throw new Error('entered an invalid username or password')
            }
        } catch (e) {
            return {success: false, error: e}
        }
    }

    registration = async (userData: IRegData): Promise<ServiceResponse<ITokens>> => {
        try {
            const candidate = await User.findOne({email: userData.email})

            if (!candidate) {
                const hashedPassword = this.hashPassword(userData.password)

                const user = await new User({
                    ...userData,
                    password: hashedPassword
                }).save()

                const tokens = this.tokenService.generateTokens({
                        email: userData.email,
                        userId: user._id.toString()
                    }
                )

                return {success: true, result: tokens}
            } else {
                throw new Error('user with same email already exist')
            }
        } catch (e) {
            return {success: false, error: e}
        }
    }

    refresh = async (refreshToken: string): Promise<ServiceResponse> => {
        try {
            if (this.tokenService.checkTokenValid(refreshToken, 'refresh')) {
                const decodedToken = this.tokenService.decodeToken(refreshToken)
                const tokens = this.tokenService.generateTokens(decodedToken)

                return {success: true, result: tokens}
            } else {
                throw new Error('refresh token not valid')
            }
        } catch (e) {
            return {success: false, error: e}
        }
    }
}

export default AuthService
