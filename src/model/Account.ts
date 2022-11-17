import { Status } from "@prisma/client";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export class AccountM {
    id?: number;
    username?: string;
    password?: string;
    promo_code?: string;
    user_id?: number;
    status?: Status;
    createdAt?: Date;
    updatedAt?: Date;

    constructor({id, username, password, promo_code, user_id, status, createdAt, updatedAt}: {id?: number, username?: string, password?: string, promo_code?: string, user_id?: number, status?: Status, createdAt?: Date, updatedAt?: Date}) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.promo_code = promo_code;
        this.user_id = user_id;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    async check() {
        return !!(await prisma.accounts.findUnique({
            where: {
                id: this.id
            }
        }));
    }
    async exists() {
        if (this.user_id == 0 || isNaN(this.user_id ?? NaN) || this.user_id == null) {
            return false;
        }
        return !!(await prisma.accounts.findUnique({
            where: {
                user_id: this.user_id
            }
        }));
    }
    async create() {
        return await prisma.accounts.create({
            data: {
                username: this.username,
                password: this.password,
                promo_code: this.promo_code,
                user_id: this.user_id
            }
        })
    }
    async modify() {
        return await prisma.accounts.update({
            where: {
                id: this.id
            },
            data: {
                username: this.username,
                password: this.password,
                promo_code: this.promo_code,
                user_id: this.user_id
            }
        })
    }
    async delete() {
        return await prisma.accounts.delete({
            where: {
                id: this.id
            }
        })
    }
    async get() {
        return await prisma.accounts.findUnique({
            where: {
                id: this.id
            }
        });
    }
    async getAll() {
        return await prisma.accounts.findMany();
    }
    async checkUsername() {
        return !!(await prisma.accounts.findUnique({
            where: {
                username: this.username
            }
        }));
    }
    async getID() {
        const account = (await prisma.accounts.findUnique({
            where: {
                user_id: this.user_id
            }
        }));
        if (account) {
            return account.id;
        }
        return null;
    }
    async activate() {
        return await prisma.accounts.update({
            where: {
                id: this.id
            },
            data: {
                status: Status.ACTIVE
            }
        })
    }
    async cold() {
        return await prisma.accounts.update({
            where: {
                id: this.id
            },
            data: {
                status: Status.COLD
            }
        })
    }
    async deactivate() {
        return await prisma.accounts.update({
            where: {
                id: this.id
            },
            data: {
                status: Status.UNACTIVE
            }
        })
    }
    async ban() {
        return await prisma.accounts.update({
            where: {
                id: this.id
            },
            data: {
                status: Status.BANNED
            }
        })
    }
}