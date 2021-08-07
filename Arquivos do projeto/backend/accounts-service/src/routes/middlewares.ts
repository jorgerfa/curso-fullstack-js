import {Request,Response} from 'express';
import commonsMiddleware from 'ms-commons/api/routes/middlewares'
import {accountSchema, loginSchema, accountUpdateSchema} from '../models/accountSchemas';
import controllerCommons from 'ms-commons/api/controllers/controller';
import {Token} from 'ms-commons/api/auth';

 function validateAccountSchema(req: Request, res: Response, next:any) {
    return commonsMiddleware.validateSchema(accountSchema, req, res, next);  
 }
 
 function validateUpdateAccountSchema(req: Request, res: Response, next:any) {
    return commonsMiddleware.validateSchema(accountUpdateSchema, req, res, next);  
 }

 function validateLoginSchema(req: Request, res: Response, next:any) {
    return commonsMiddleware.validateSchema(loginSchema, req, res, next);  
 }

async function validateAuthentication(req: Request, res: Response, next:any) { 
   return commonsMiddleware.validateAuth(req,res,next);
}

function validateAutorization(req: Request, res: Response, next:any){
      const accountId = parseInt(req.params.id);
      if (!accountId) return res.status(400).end();  //throw new Error('ID is in invalid format.');

      const token =  controllerCommons.getToken(res) as Token;
      if (accountId !== token.accountId)  return res.status(403).end();

      next();
}

 export{validateAccountSchema,validateAutorization,validateLoginSchema,validateUpdateAccountSchema,validateAuthentication}