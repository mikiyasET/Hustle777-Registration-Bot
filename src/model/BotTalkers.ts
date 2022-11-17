import {isNull} from "util";
import {BotTalkersC} from "../controllers/BotTalkers";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export class BotTalkersM {
    id?:number;
    user_id?:number;
    current?:string;
    previous?:string;
    waiting?:number;

    constructor({id, user_id, current, previous, waiting}: {id?: number, user_id?: number, current?: string, previous?: string, waiting?: number}) {
        this.id = id;
        this.user_id = user_id;
        this.current = current;
        this.previous = previous;
        this.waiting = waiting;
    }

    async check():Promise<boolean> {
        // if id is null or undifined or 0 or empty string or nan return false
        if (this.id == 0 || isNaN(this.id ?? NaN) || this.id == null) {
            return false;
        }else {
            return !!(await prisma.botTalkers.findUnique({
                where: {
                    id: this.id
                }
            }));
        }
    }

    async create() {
        if (!await this.check()) {
            return await prisma.botTalkers.create({
                data: {
                    user_id: this.user_id,
                    current: this.current,
                    previous: this.previous,
                    waiting: this.waiting,
                }
            })
        }
    }

    async modify() {
        return await prisma.botTalkers.update({
            where: {
                id: this.id
            },
            data: {
                current: this.current,
                previous: this.previous,
                waiting: this.waiting,
            }
        })
    }

    async get() {
        return await prisma.botTalkers.findUnique({
            where: {
                id: this.id
            }
        });
    }

    async getAll() {
        return await prisma.botTalkers.findMany();
    }

    async getID():Promise<number> {
        return (await prisma.botTalkers.findUnique({
            where: {
                user_id: this.user_id
            }
        }))?.id;
    }

    async exists():Promise<boolean> {
        if (this.user_id == null) {
            return false;
        }
        return (await prisma.botTalkers.findUnique({
            where: {
                user_id: this.user_id
            }
        })) != null;
    }

    async isWaiting():Promise<boolean> {
        return (await prisma.botTalkers.findUnique({
            where: {
                user_id: this.user_id
            }
        })).waiting == 1;
    }

    async getPrevious():Promise<string|null> {
        // if user_id is null return null
        if (this.user_id == null) {
            return null;
        }
        return (await prisma.botTalkers.findUnique({
            where: {
                user_id: this.user_id
            }
        })).previous;
    }

    async getCurrent():Promise<string> {
        return (await prisma.botTalkers.findUnique({
            where: {
                user_id: this.user_id
            }
        })).current;
    }

    async PushData() {
        if (await this.exists()) {
            await this.modify();
        }else {
            await this.create();
        }
    }
}