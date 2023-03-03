import {ClearDB, CloseDB, ConnectDB} from "../../utils/virtual-mongodb-server";
import User from "../../models/User";
import {faker} from "@faker-js/faker";
import AuthService from "../../services/auth.service";
import jwt from "jsonwebtoken";

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh token secret'
const authService = new AuthService();

describe('Auth Service Tests', () => {
    const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password(9),
        email: faker.internet.email()
    }

    const createUser = async () => {
        await new User({
            ...userData,
            password: Object.getPrototypeOf(authService).hashPassword(userData.password)
        }).save()
    }

    beforeAll(async () => {
        await ConnectDB();
    })

    afterEach(async () => {
        await ClearDB();
    })

    afterAll(async () => {
        await CloseDB();
    })

    describe('Login Tests', () => {
        it('Passed invalid password', async () => {
            await createUser();

            const res = await authService.login({
                email: userData.email,
                password: faker.internet.password(10)
            })

            expect(res.success).toBe(false)
            // expect(res.error).toBe('entered an invalid username or password')
        })

        it('Passed invalid email', async () => {
            await createUser();

            const res = await authService.login({
                email: faker.internet.email(),
                password: userData.password
            })

            expect(res.success).toBe(false);
        })

        it('Passed invalid email and password', async () => {
            await createUser();

            const res = await authService.login({
                email: faker.internet.email(),
                password: faker.internet.password(10)
            })

            expect(res.success).toBe(false);
        })

        it('Credentials not passed', async () => {
            await createUser();

            const res = await authService.login({
                email: '',
                password: ''
            })

            expect(res.success).toBe(false);
        })

        it('User doesnt exists', async () => {
            const res = await authService.login({
                email: faker.internet.email(),
                password: faker.internet.password(10)
            })

            expect(res.success).toBe(false);
        })

        it('Passed right credentials', async () => {
            await createUser();

            const res = await authService.login({
                email: userData.email,
                password: userData.password
            })

            expect(res.success).toBe(true);
        })
    })

    describe('Registration Tests', () => {
        it('User already exists', async () => {
            await createUser();
            const res = await authService.registration(userData);

            expect(res.success).toBe(false);
        })

        it('User data not provided', async () => {
            const res = await authService.registration({
                firstName: '',
                lastName: '',
                password: '',
                email: ''
            })

            expect(res.success).toBe(false);
        })

        it('Successful registration', async () => {
            const res = await authService.registration(userData);

            expect(res.success).toBe(true);
            expect(res.result?.accessToken).toBeTruthy();
            expect(res.result?.refreshToken).toBeTruthy();
        })
    })

    describe('Refresh Tests', () => {
        const tokenData = {
            email: userData.email,
            userId: faker.datatype.uuid()
        }

        it('Token not passed', async () => {
            const res = await authService.refresh('');

            expect(res.success).toBe(false)
        })

        it('Expired token passed', async () => {
            const token = jwt.sign(
                tokenData,
                refreshTokenSecret,
                {expiresIn: 0}
            );
            const res = await authService.refresh(token);

            expect(res.success).toBe(false);
        })

        it('Successful refresh', async () => {
            const token = jwt.sign(
                tokenData,
                refreshTokenSecret,
                {expiresIn: 100}
            );

            const res = await authService.refresh(token);

            expect(res.success).toBe(true);
            expect(res.result?.accessToken).toBeTruthy();
            expect(res.result?.refreshToken).toBeTruthy();
        })
    })
})