import {RequestM} from "../model/Request";
import {RequestStatus} from "@prisma/client";

export class RequestC extends RequestM {
    constructor({id, account_id, status}: {id?: number, account_id?: number, status?: RequestStatus}) {
        super({id, account_id, status});
    }
}
