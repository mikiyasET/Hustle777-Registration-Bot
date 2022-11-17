import { captchaStatus } from "@prisma/client";
import {CaptchaM} from "../model/Captcha";

export class CaptchaC extends CaptchaM {
    constructor({id, user_id, captcha, status, createdAt, updatedAt}: {id?: number,user_id?: number,captcha?: string, status?: captchaStatus, createdAt?: Date, updatedAt?: Date}) {
        super({id, user_id, captcha, status, createdAt, updatedAt});
    }
}