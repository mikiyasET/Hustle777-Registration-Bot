import {BotTalkersM} from "../model/BotTalkers";
import {UsersC} from "./Users";

export class BotTalkersC extends BotTalkersM {

    constructor({id, user_id, current, previous, waiting}: {id?: number, user_id?: number, current?: string, previous?: string, waiting?: number}) {
        super({id, user_id, current, previous, waiting});
    }
    async gets(tg_id:string) {
        const user = new UsersC({tg_id: tg_id.toString()});
        const user_id = await user.getID();
        user.id = user_id;
        if (await user.check()) {
            super.user_id = user_id;
            if (await super.exists()){
                super.id = await super.getID();
            }else {
                super.id = (await super.create()).id;
            }
            return true;
        }
        return false;
    }
    async talk(waiting: number = 1) {
        this.waiting = waiting;
        this.id = await this.getID();
        await super.PushData();
    }
    async done() {
        await this.talk(0);
    }
    async users() {
        return await super.getAll();
    }
}