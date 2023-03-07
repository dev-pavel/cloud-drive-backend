import TokensService from "../../services/tokens.service";
import {IUserToken} from "../../interfaces/interfaces";
import {faker} from "@faker-js/faker";
import jwt from "jsonwebtoken";

describe('Token Service Tests', () => {
    const tokensService = new TokensService();
    const userData: IUserToken = {
        email: faker.internet.email(),
        userId: faker.datatype.uuid()
    }

    describe('Generate Tokens Tests', () => {
        it('Successful token generating', () => {
            const res = tokensService.generateTokens(userData);
            const accessToken = jwt.decode(res.accessToken) as IUserToken;
            const refreshToken = jwt.decode(res.refreshToken) as IUserToken;

            expect({
                email: accessToken.email,
                userId: accessToken.userId
            }).toEqual(userData);
            expect({
                email: refreshToken.email,
                userId: refreshToken.userId
            }).toEqual(userData);
            expect(typeof res.accessToken).toBe("string");
            expect(typeof res.refreshToken).toBe("string");
        })
    })

    describe('Check Token Valid Tests', () => {
        it('Provided invalid token (access)', () => {
            const res = tokensService.checkTokenValid(faker.random.words(2), 'access');
            expect(res).toBe(false);
        })

        it('Provided invalid token (refresh)', () => {
            const res = tokensService.checkTokenValid(faker.random.words(2), 'refresh');
            expect(res).toBe(false);
        })

        it('Provided empty string (access)', () => {
            const res = tokensService.checkTokenValid('', 'access');
            expect(res).toBe(false);
        })

        it('Provided empty string (refresh)', () => {
            const res = tokensService.checkTokenValid('', 'refresh');
            expect(res).toBe(false);
        })

        it('Provided valid refresh token (access)', () => {
            const res = tokensService.checkTokenValid(tokensService.generateTokens(userData).refreshToken, 'access');
            expect(res).toBe(false);
        })

        it('Provided valid access token (refresh)', () => {
            const res = tokensService.checkTokenValid(tokensService.generateTokens(userData).accessToken, 'refresh');
            expect(res).toBe(false);
        })

        it('Provided valid token (access)', () => {
            const res = tokensService.checkTokenValid(tokensService.generateTokens(userData).accessToken, 'access');
            expect(res).toBe(true);
        })

        it('Provided valid token (refresh)', () => {
            const res = tokensService.checkTokenValid(tokensService.generateTokens(userData).refreshToken, 'refresh');
            expect(res).toBe(true);
        })
    })

    describe('Decode Token Test', () => {
        it('Provided empty string', () => {
            const res = tokensService.decodeToken('');
            expect(res).toBe(null);
        })

        it('Provided invalid token', () => {
            const res = tokensService.decodeToken(faker.random.words(3));
            expect(res).toBe(null);
        })

        it('Successful token decode', () => {
            const accessToken = tokensService.generateTokens(userData).refreshToken;
            const res = tokensService.decodeToken(accessToken);

            expect({
                email: res?.email,
                userId: res?.userId
            }).toEqual(userData);
        })
    })
})