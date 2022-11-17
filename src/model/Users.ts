import {Status} from "@prisma/client";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export class UsersM {
    id?:number;
    tg_id?:string;
    username?:string;
    fname?:string;
    lname?:string;
    status?:Status;

    constructor({id, tg_id, username, fname, lname,status}: {id?: number,tg_id?: string,username?: string, fname?: string, lname?: string, status?: Status}) {
        this.id = id;
        this.tg_id = tg_id;
        this.username = username;
        this.fname = fname;
        this.lname = lname;
        this.status = status;
    }

    async check():Promise<boolean> {
        // if id is null or undifined or 0 or empty string or nan return false
        if (this.id == 0 || isNaN(this.id ?? NaN) || this.id == null) {
            return false;
        }else {
            return !!(await prisma.users.findUnique({
                where: {
                    id: this.id
                }
            }));
        }
    }
    async exists():Promise<boolean> {
        if (this.tg_id == null) {
            return false;
        }
        return (await prisma.users.findUnique({
            where: {
                tg_id: this.tg_id
            }
        })) != null;
    }

    async create() {
        if (!await this.exists()) {
            return await prisma.users.create({
                data: {
                    tg_id: this.tg_id,
                    username: this.username,
                    fname: this.fname,
                    lname: this.lname,
                }
            })
        }
    }
    async modify() {
        return await prisma.users.update({
            where: {
                id: this.id
            },
            data: {
                tg_id: this.tg_id,
                username: this.username,
                fname: this.fname,
                lname: this.lname
            }
        })
    }

    async get() {
        return await prisma.users.findUnique({
            where: {
                id: this.id
            }
        });
    }
    async getAll() {
        return await prisma.users.findMany();
    }
    async getID():Promise<number> {
        const x = (await prisma.users.findUnique({
            where: {
                tg_id: this.tg_id
            }
        }));
        if (x == null) {
            return 0;
        }
        return x.id;
    }
    async getTgID() {
        return (await prisma.users.findUnique({
            where: {
                id: this.id
            }
        })).tg_id;
    }
    async isActive():Promise<boolean> {
        const user = (await prisma.users.findUnique({
            where: {
                id: this.id
            }
        }));
        if (user == null) {
            return false;
        }
        return user.status == Status.ACTIVE;
    }

    async Activate() {
        return await prisma.users.update({
            where: {
                id: this.id
            },
            data: {
                status: Status.ACTIVE
            }
        })
    }
}