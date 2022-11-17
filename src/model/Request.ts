import { RequestStatus } from "@prisma/client";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export class RequestM {
    id?: number;
    account_id?: number;
    status?: RequestStatus;

    constructor({id, account_id, status}: {id?: number, account_id?: number, status?: RequestStatus}) {
        this.id = id;
        this.account_id = account_id;
        this.status = status;
    }

    async check():Promise<boolean> {
        // if id is null or undifined or 0 or empty string or nan return false
        if (this.id == 0 || isNaN(this.id ?? NaN) || this.id == null) {
            return false;
        }else {
            return !!(await prisma.requests.findUnique({
                where: {
                    id: this.id
                }
            }));
        }
    }

    async create() {
        return await prisma.requests.create({
            data: {
                account_id: this.account_id,
            }
        })
    }
    async modify() {
        return await prisma.requests.update({
            where: {
                id: this.id
            },
            data: {
                account_id: this.account_id
            }
        })
    }
    async delete() {
        return await prisma.requests.delete({
            where: {
                id: this.id
            }
        })
    }

    async get() {
        return await prisma.requests.findUnique({
            where: {
                id: this.id
            }
        });
    }

    async getAll() {
        return await prisma.requests.findMany();
    }

    async accept() {
        return await prisma.requests.update({
            where: {
                id: this.id
            },
            data: {
                status: RequestStatus.ACCEPTED
            }
        })
    }
    async reject() {
        return await prisma.requests.update({
            where: {
                id: this.id
            },
            data: {
                status: RequestStatus.REJECTED
            }
        })
    }

    async pending() {
        return (await prisma.requests.findMany({
            where: {
                status: RequestStatus.PENDING
            }
        })) != null;
    }
    async accepted() {
        return (await prisma.requests.findMany({
            where: {
                status: RequestStatus.ACCEPTED
            }
        })) != null;
    }
    async rejected() {
        return (await prisma.requests.findMany({
            where: {
                status: RequestStatus.REJECTED
            }
        })) != null;
    }
}