import {AccountM} from "../model/Account";
import {Status} from "@prisma/client";

export class AccountC extends AccountM {
    constructor({id, username, password, promo_code, user_id, status, createdAt, updatedAt}: {id?: number, username?: string, password?: string, promo_code?: string, user_id?: number, status?: Status, createdAt?: Date, updatedAt?: Date}) {
        super({id, username, password, promo_code, user_id, status, createdAt, updatedAt});
    }
}