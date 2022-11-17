import {AdminM} from "../model/Admin";

export class AdminC extends AdminM {
    constructor({id, name, username, password, user_id}: {id?: number, name?: string, username?: string, password?: string, user_id?: number}) {
        super({id, name, username, password, user_id});
    }
}