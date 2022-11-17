import {AdminC} from "./Admin";
import {UsersC} from "./Users";
import {Basic} from "../messages/Basic";

export class Notification {
    private readonly ctx;
    private basicMessages: Basic;
    constructor(ctx:any) {
        this.ctx = ctx;
        this.basicMessages = new Basic(this.ctx);
    }
    async sendToAdmin(message: string,keyboards:any) {
        const adminObj = new AdminC({});
        const admins = await adminObj.getAll();
        if (admins.length > 0) {
            for (const admin of admins) {
                const User = new UsersC({id: admin.user_id});
                this.ctx.telegram.sendMessage(await User.getTgID(), message,keyboards);
            }
        }
    }
    async sendToUser(message: string, tg_id: string) {
        this.ctx.telegram.sendMessage(parseInt(tg_id), message);
    }
}