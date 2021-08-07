import {contactStatus} from "./contactStatus";

export interface IContact {
    id?: number,
    accountId: number,
    name: string,
    email : string,
    phone? : string,
    status? :contactStatus
}