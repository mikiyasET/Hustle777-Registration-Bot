const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export class AdminM {
    id?: number;
    name?: string;
    username?: string;
    password?: string;
    user_id?: number;

    constructor({id, name, username, password, user_id}: {id?: number, name?: string, username?: string, password?: string, user_id?: number}) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.user_id = user_id;
    }

    async check() {
        return !!(await prisma.admin.findUnique({
            where: {
                id: this.id
            }
        }));
    }
    async create() {
        return await prisma.admin.create({
            data: {
                name: this.name,
                username: this.username,
                password: this.password,
                user_id: this.user_id
            }
        })
    }
    async modify() {
        return await prisma.admin.update({
            where: {
                id: this.id
            },
            data: {
                name: this.name,
                username: this.username,
                password: this.password,
                user_id: this.user_id
            }
        })
    }
    async get() {
        return await prisma.admin.findUnique({
            where: {
                id: this.id
            }
        });
    }
    async getAll() {
        return await prisma.admin.findMany();
    }
    async checkUsername() {
        return !!(await prisma.admin.findUnique({
            where: {
                username: this.username
            }
        }));
    }
    async checkName() {
        return !!(await prisma.admin.findUnique({
            where: {
                name: this.name
            }
        }));
    }
    async login() {
        return await prisma.admin.findFirst({
            where: {
                username: this.username,
                password: this.password
            }
        });
    }
    async getUser() {
        return await prisma.admin.findUnique({
            where: {
                user_id: this.user_id
            }
        });
    }
    async exists():Promise<boolean> {
        if (this.user_id == null) {
            return false;
        }
        return (await prisma.admin.findUnique({
            where: {
                user_id: this.user_id
            }
        })) != null;
    }
}