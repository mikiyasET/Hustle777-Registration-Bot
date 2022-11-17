import {captchaStatus} from "@prisma/client";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export class CaptchaM {
    id?:number;
    user_id?:number;
    captcha?:string;
    status?:captchaStatus;
    createdAt?:Date;
    updatedAt?:Date;

    constructor({id, user_id, captcha, status, createdAt, updatedAt}: {id?: number,user_id?: number,captcha?: string, status?: captchaStatus, createdAt?: Date, updatedAt?: Date}) {
        this.id = id;
        this.user_id = user_id;
        this.captcha = captcha;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    async check():Promise<boolean> {
        // if id is null or undifined or 0 or empty string or nan return false
        if (this.id == 0 || isNaN(this.id ?? NaN) || this.id == null) {
            return false;
        }else {
            return !!(await prisma.captcha.findUnique({
                where: {
                    id: this.id
                }
            }));
        }
    }
    async exists():Promise<boolean> {
        if (this.user_id == null) {
            return false;
        }
        return (await prisma.captcha.findUnique({
            where: {
                user_id: this.user_id
            }
        })) != null;
    }

    async create() {
        if (!await this.exists()) {
            return await prisma.captcha.create({
                data: {
                    user_id: this.user_id,
                    captcha: this.captcha
                }
            })
        }
    }
    async modify() {
        return await prisma.captcha.update({
            where: {
                id: this.id
            },
            data: {
                user_id: this.user_id,
                captcha: this.captcha
            }
        })
    }
    async delete() {
        return await prisma.captcha.delete({
            where: {
                id: this.id
            }
        })
    }

    async get() {
        return await prisma.captcha.findUnique({
            where: {
                id: this.id
            }
        })
    }
    async getByUserId() {
        return await prisma.captcha.findUnique({
            where: {
                user_id: this.user_id
            }
        })
    }
    async getByCaptcha() {
        return await prisma.captcha.findUnique({
            where: {
                captcha: this.captcha
            }
        })
    }
    async validateCaptcha() {
        if (this.captcha == null) {
            return false;
        }
        return await prisma.captcha.findUnique({
            where: {
                captcha: this.captcha
            }
        }) != null;
    }
    async getAll() {
        return await prisma.captcha.findMany()
    }
    async getID() {
        if (await this.exists()) {
            return (await prisma.captcha.findUnique({
                where: {
                    user_id: this.user_id
                }
            })).id;
        }
        return 0;
    }
    async isSolved() {
        return (await prisma.captcha.findFirst({
            where: {
                captcha: this.captcha,
                status: captchaStatus.SOLVED
            }
        })) != null;
    }
    async solve() {
        return await prisma.captcha.update({
            where: {
                id: this.id
            },
            data: {
                status: captchaStatus.SOLVED
            }
        })
    }
}