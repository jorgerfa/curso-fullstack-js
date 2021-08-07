import request from 'supertest';
import app from './../src/app';
import {IAccount} from '../src/models/accounts';
import repository from '../src/models/accountRepository';
import {describe,expect,it,beforeAll,afterAll} from '@jest/globals';
import auth from '../src/auth';

const testEmail = 'jest@accounts.auth.com';
const hashPassword = '$2a$10$Z2zOIKC1oynm/0ntt7r6HuioGjwI7PTkmUi2Lp4EL.fJhdH.fRDW6'; //"123456"
const testPassword = "123456";
let jwt = '';
let testAccountId = 0;

beforeAll(async  () => {
    const testAccount = {
        name: "jest",
        email: testEmail,
        password: hashPassword,
        domain: 'jest.com'
    }
    const result = await repository.add(testAccount);
    testAccountId = result.id!;
    jwt = auth.sign(testAccountId);
})

afterAll(async () => {
     await repository.removeByEmail(testEmail);
})

describe('Testando rotas de autenticação', () => {
    it('POST /accounts/login - 200 OK', async () => {

        //testing
        const payload = {
            email: testEmail,
            password: testPassword
        }

        const resultado = await request(app)
        .post('/accounts/login')
        .send(payload);

        expect(resultado.status).toEqual(200);
        expect(resultado.body.auth).toBeTruthy();
        expect(resultado.body.token).toBeTruthy();
    })

    it('POST /accounts/login - 422 Unprocessable Entity', async () => {
        const payload = {
            email: testEmail
        }

        const resultado = await request(app)
        .post('/accounts/login')
        .send(payload)

        expect(resultado.status).toEqual(422);
    })

    it('POST /accounts/login - 401 Unauthorized', async () => {
        const payload = {
            email: testEmail,
            password: testPassword+'1'
        }

        const resultado = await request(app)
        .post('/accounts/login')
        .send(payload)

        expect(resultado.status).toEqual(401);
    })

    it('POST /accounts/logout - 200 OK', async () => {
        const resultado = await request(app)
        .post('/accounts/logout')
        .set('x-access-token', jwt);
        
        expect(resultado.status).toEqual(200); 
    })
})