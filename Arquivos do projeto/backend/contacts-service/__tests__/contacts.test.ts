import {jest,describe,expect,it,beforeAll,afterAll} from '@jest/globals';
import request from 'supertest';
import app from './../src/app';
import accountsApp from '../../accounts-service/src/app'
import {IContact} from '../src/models/contact';
import repository from '../src/models/contactRepository';


const testEmail = 'jest@accounts.com';
const testEmail2 = 'jest2@accounts.com';
const testPassword = '123456';
let jwt:string = '';
let testAccountId:number = 0;
let testContactId:number = 0;

beforeAll(async  () => {
    const testAccount = {
        name: "jest",
        email: testEmail,
        password: testPassword,
        domain: 'jest.com'
    }
    const accountResponse = await request(accountsApp)
            .post('/accounts/')
            .send(testAccount);
        console.log(`accountResponse: ${accountResponse.status}`);
    testAccountId = accountResponse.body.id;
        console.log(`testeAccountId: ${testAccountId}`);

    const loginResponse = await request(accountsApp)
        .post('/accounts/login')
        .send({
            email: testEmail,
            password: testPassword
        });
        console.log(`loginResponse: ${loginResponse.status}`);
    jwt = loginResponse.body.token;

    const testContact = {
        name : 'jest',
        email : testEmail,
        phone : '51123456789'
    } as IContact;
    const addResult =  await repository.add(testContact, testAccountId);
    console.log(`addResult: ${addResult}`);
    testContactId = addResult.id!;
    console.log(`testContactId: ${testContactId}`);
})

afterAll(async () => {
    const removeResult = await repository.removeByEmail(testEmail,testAccountId);
    const removeResult2 = await repository.removeByEmail(testEmail2,testAccountId);
    console.log(`removeResult: ${removeResult}:${removeResult2}`);

    const deleteResponse = await request(accountsApp)
        .delete('/accounts/' + testAccountId)
        .set('x-access-token',jwt);
    console.log(`deleteResponse: ${deleteResponse.status}`);

    const logoutResponse =  await request(accountsApp)
        .post('/accounts/logout')
        .set('x-access-token',jwt);
    console.log(`logoutResponse: ${logoutResponse.status}`);  
})

describe('Testando rotas do contacts', () => {
    it('GET /contacts/ - deve retornar statusCode 200', async ()=> {
        const resultado = await request(app)
        .get('/contacts/')
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(200)
        expect(Array.isArray(resultado.body)).toBeTruthy;
    })

    it('GET /contacts/ - deve retornar statusCode 401', async ()=> {
        const resultado = await request(app)
        .get('/contacts/');

        expect(resultado.status).toEqual(401)
    })

    it('GET /contacts/:id - deve retornar statusCode 200', async ()=> {
        const resultado = await request(app)
        .get('/contacts/'+ testContactId)
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(200)
        expect(resultado.body.id).toEqual(testContactId);
    })

    it('GET /contacts/:id - deve retornar statusCode 404', async ()=> {
        const resultado = await request(app)
        .get('/contacts/-1')
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(404)
    })

    it('GET /contacts/:id - deve retornar statusCode 400', async ()=> {
        const resultado = await request(app)
        .get('/contacts/abc')
        .set('x-access-token',jwt);

        expect(resultado.status).toEqual(400)
    })

    it('GET /contacts/:id - deve retornar statusCode 401', async ()=> {
        const resultado = await request(app)
        .get('/contacts/'+ testContactId)
      
        expect(resultado.status).toEqual(401)
    })

    it('POST /contacts/:id - deve retornar statusCode 201', async ()=> {
        const testContact = {
            name : 'jest2',
            email : testEmail2,
            phone : '51123456789'
        } as IContact;

        const resultado = await request(app)
        .post('/contacts/')
        .set('x-access-token',jwt)
        .send(testContact)

        expect(resultado.status).toEqual(201)
        expect(resultado.body.id).toBeTruthy;
    })

    it('POST /contacts/:id - deve retornar statusCode 422', async ()=> {
        const payload = {
            street : 'jest2'
        } 

        const resultado = await request(app)
        .post('/contacts/')
        .set('x-access-token',jwt)
        .send(payload)

        expect(resultado.status).toEqual(422)
    })

    it('POST /contacts/:id - deve retornar statusCode 401', async ()=> {
        const payload = {
            name : 'jest',
            email : testEmail2,
            phone : '51123456789'
        } as IContact;

        const resultado = await request(app)
        .post('/contacts/')
        .send(payload)

        expect(resultado.status).toEqual(401)
    })

    it('POST /contacts/:id - deve retornar statusCode 400', async ()=> {
        const payload = {
            name : 'jest3',
            email : testEmail,
            phone : '51123456789'
        } as IContact;

        const resultado = await request(app)
        .post('/contacts/')
        .set('x-access-token',jwt)
        .send(payload)

        expect(resultado.status).toEqual(400)
    })

    it('PATCH /contacts/:id - deve retornar statusCode 200', async ()=> {
        const payload = {
            name : 'Luiz'           
        };

        const resultado = await request(app)
        .patch('/contacts/' + testContactId)
        .set('x-access-token',jwt)
        .send(payload)

        expect(resultado.status).toEqual(200);
        expect(resultado.body.name).toEqual("Luiz");
    })

    it('PATCH /contacts/:id - deve retornar statusCode 401', async ()=> {
        const payload = {
            name : 'Luiz'           
        };

        const resultado = await request(app)
        .patch('/contacts/' + testContactId)
        .send(payload)

        expect(resultado.status).toEqual(401);
    })

    it('PATCH /contacts/:id - deve retornar statusCode 422', async ()=> {
        const payload = {
            street : 'Luiz'           
        };

        const resultado = await request(app)
        .patch('/contacts/' + testContactId)
        .set('x-access-token',jwt)
        .send(payload)

        expect(resultado.status).toEqual(422);
    })

    it('PATCH /contacts/:id - deve retornar statusCode 404', async ()=> {
        const payload = {
            name : 'Luiz'           
        };

        const resultado = await request(app)
        .patch('/contacts/-1')
        .set('x-access-token',jwt)
        .send(payload)

        expect(resultado.status).toEqual(404);
    })

    it('PATCH /contacts/:id - deve retornar statusCode 400', async ()=> {
        const payload = {
            name : 'Luiz'           
        };

        const resultado = await request(app)
        .patch('/contacts/abc')
        .set('x-access-token',jwt)
        .send(payload)

        expect(resultado.status).toEqual(400);
    })
})