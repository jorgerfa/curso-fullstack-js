import request from 'supertest';
import {Response} from 'express';
import app from './../src/app';
import {IAccount} from '../src/models/accounts';
import repository from '../src/models/accountRepository';
import auth from '../src/auth';
import {describe,expect,it,beforeAll,afterAll} from '@jest/globals';

const testEmail = 'jest@accounts.com';
const testEmail2 = 'jest2@accounts.com';
const hashPassword = '$2a$10$Z2zOIKC1oynm/0ntt7r6HuioGjwI7PTkmUi2Lp4EL.fJhdH.fRDW6'; //"123456"
// const testPassword = "123456";
let jwt:string = '';
let testId:number = 0;

beforeAll(async  () => {
    const testAccount = {
        name: "jest",
        email: testEmail,
        password: hashPassword,
        domain: 'jest.com'
    }
    const result = await repository.add(testAccount);
    testId = result.id!;
    jwt = await auth.sign(result.id!);
})

afterAll(async () => {
    await repository.removeByEmail(testEmail);
    await repository.removeByEmail(testEmail2);
})

describe('Testando rotas do accounts', () => {
    it('GET /accounts/ - deve retornar statusCode 200', async ()=> {
        const resultado = await request(app)
        .get('/accounts/')
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(200)
        expect(Array.isArray(resultado.body)).toBeTruthy;
    })

    it('POST /accounts/ - deve retornar statusCode 201', async () => {
        const payload = {
            name:"jest2",
            email:testEmail2,
            password:'123456',
            domain:'jest.com'
        }

        const resultado = await request(app)
        .post('/accounts/')
        .send(payload)

        expect(resultado.status).toEqual(201)
        expect(resultado.body.id).toBeTruthy();
    })

    it('POST /accounts/ - deve retornar statusCode 422', async () => {
        const payload = {
            street:"rua dos tupis",
            city: 'Gravatai',
            state: "RS"
        }

        const resultado = await request(app)
        .post('/accounts/')
        .send(payload)

        expect(resultado.status).toEqual(422);
    })

    it('PATCH /accounts/:id - deve retornar statusCode 200', async () => {
        const payload = {         
                name:"Daniel Castro",
        }

        const resultado = await request(app)
        .patch('/accounts/' + testId)
        .send(payload)
        .set('x-access-token',jwt)

        expect(resultado.status).toEqual(200);
        expect(resultado.body.id).toEqual(testId);
        expect(resultado.body.name).toEqual(payload.name);
  
    })

    it('PATCH /accounts/:id - deve retornar statusCode 400', async () => {
        const payload = {         
                name:"Daniel Castro",
        }

        const resultado = await request(app)
        .patch('/accounts/abc')
        .send(payload)
        .set('x-access-token',jwt)

        expect(resultado.status).toEqual(400);
    })

    it('PATCH /accounts/:id - deve retornar statusCode 403', async () => {
        const payload = {         
                name:"Daniel Castro",
        }

        const resultado = await request(app)
        .patch('/accounts/-1')
        .send(payload)
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(403);
    })


    it('GET /accounts/:id - deve retornar statusCode 200', async ()=> {
        const resultado = await request(app)
        .get('/accounts/' + testId)
        .set('x-access-token',jwt);


        expect(resultado.status).toEqual(200)
        expect(resultado.body.id).toBe(testId);
    })
    
    it('GET /accounts/:id - deve retornar statusCode 403', async ()=> {
        const resultado = await request(app)
        .get('/accounts/-1')
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(403);
    })

    it('GET /accounts/:id - deve retornar statusCode 400', async ()=> {
        const resultado = await request(app)
        .get('/accounts/abc')
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(400);
    })

    it('DELETE /accounts/:id - deve retornar statusCode 200', async ()=> {
        const resultado = await request(app)
        .delete('/accounts/' + testId)
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(200);
    })

    it('DELETE /accounts/:id - deve retornar statusCode 403', async ()=> {
        const resultado = await request(app)
        .delete('/accounts/-1')
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(403);
    })
})