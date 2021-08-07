import {Router, Request, Response} from 'express';
import accountsController from '../controllers/accounts';
import {validateAccountSchema,validateAutorization, validateLoginSchema, validateUpdateAccountSchema, validateAuthentication } from './middlewares';

const router = Router();

router.get("/accounts", validateAuthentication, accountsController.getAccounts);

router.get("/accounts/:id", validateAuthentication,validateAutorization, accountsController.getAccount);

router.patch("/accounts/:id", validateAuthentication, validateAutorization, validateUpdateAccountSchema, accountsController.setAccount);

router.post("/accounts", validateAccountSchema, accountsController.addAccount);

router.post("/accounts/login", validateLoginSchema, accountsController.loginAccount);

router.post("/accounts/logout", validateAuthentication, accountsController.logoutAccount);

router.delete("/accounts/:id", validateAuthentication, validateAutorization, accountsController.deleteAccount);

export default router;