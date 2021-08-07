import {AccountStatus} from './accountStatus';

export interface IAccount{
    id?:number, /* id:string|number */
    name:string,
    email:string,
    password:string,
    status?:AccountStatus,
    domain:string
}

