import {UsersM} from "../model/Users";
import {Status} from "@prisma/client";

export class UsersC extends UsersM {
    constructor({id, tg_id, username, fname, lname, status}: {id?: number, tg_id?: string, username?: string, fname?: string, lname?: string, status?: Status}) {
        super({id, tg_id, username, fname, lname, status});
    }
}