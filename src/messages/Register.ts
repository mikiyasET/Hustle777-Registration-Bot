import {BotTalkersC} from "../controllers/BotTalkers";
import {RegisterKYB} from "../keyboards/normal/RegisterKYB";
import {RegisterInlineKYB} from "../keyboards/inline/RegisterInlineKYB";
import {AccountC} from "../controllers/Account";
import {UsersC} from "../controllers/Users";
import {RequestC} from "../controllers/Request";
import {Notification} from "../controllers/Notification";

export class Register {

    private readonly ctx;
    private talker;
    private readonly registerKYB;
    private readonly registerInlineKYB;

    constructor(ctx: any) {
        this.ctx = ctx;
        this.registerKYB = new RegisterKYB(this.ctx);
        this.registerInlineKYB = new RegisterInlineKYB(this.ctx);
        this.talker = new BotTalkersC({});
    }

    async askUsername() {
        await this.talker.gets(this.ctx.chat.id);
        this.talker.previous = await this.talker.getCurrent();
        this.talker.current = "register_username";
        await this.talker.talk();
        await this.ctx.reply("Please enter your username");
    }
    async askPassword() {
        const account = new AccountC({username: this.ctx.message.text});
        if (!(await account.checkUsername())) {
            await this.talker.gets(this.ctx.chat.id);
            this.talker.previous = this.ctx.message.text;
            this.talker.current = "register_password";
            await this.talker.talk();
            await this.passwordMessage();
        }else {
            await this.ctx.reply("Username already taken");
            await this.askUsername();
        }
    }
    async passwordMessage() {
        await this.ctx.reply("Please enter your password", this.registerKYB.backKYB());
    }
    async askConfirmPassword() {
        await this.talker.gets(this.ctx.chat.id);
        this.talker.previous = `${await this.talker.getPrevious()},${this.ctx.message.text}`;
        this.talker.current = "register_confirm_password";
        await this.talker.talk();
        await this.confirmPasswordMessage();
        await this.ctx.deleteMessage(this.ctx.message.message_id);
    }
    async confirmPasswordMessage() {
        await this.ctx.reply("Please confirm your password", this.registerKYB.backKYB());
    }
    async askPromoCode() {
        await this.talker.gets(this.ctx.chat.id);
        const temp = `${await this.talker.getPrevious()},${this.ctx.message.text}`;
        const data = temp.split(",");
        await this.ctx.deleteMessage(this.ctx.message.message_id);
        if (data[1] == data[2]) {
            this.talker.current = "register_promo_code";
            await this.talker.talk();
            await this.promoCodeMessage();
        }else {
            await this.ctx.reply("Password not match");
            const prev = (await this.talker.getPrevious()) ?? "";
            const data:string[] = prev.split(",");
            this.talker.previous = data[0];
            this.talker.current = "register_password";
            await this.talker.talk();
            await this.passwordMessage();
        }
    }
    async promoCodeMessage() {
        await this.ctx.reply("Please enter your promo code", this.registerKYB.noPromoKYB());
    }

    async process() {
        try {
            await this.talker.gets(this.ctx.chat.id);
            this.talker.previous = `${await this.talker.getPrevious()},${this.ctx.message.text}`;
            this.talker.current = "register_process";
            if (this.ctx.message.text == "Skip") {
                this.talker.previous = `${await this.talker.getPrevious()},0`;
            }
            const data = this.talker.previous.split(",");
            const username = data[0];
            const password = data[1];
            const promo_code = data[2] == "0" ? undefined : data[2];
            const user = new UsersC({tg_id: this.ctx.chat.id.toString()});
            const user_id = await user.getID();
            const account = new AccountC({
                username: username,
                password: password,
                promo_code: promo_code,
                user_id: user_id
            });
            if (await account.exists()){
                account.id = await account.getID();
                const created = await account.modify();
                const requestObj = new RequestC({account_id: created.id});
                const request = await requestObj.create();
                const notification = new Notification(this.ctx);
                await notification.sendToAdmin(`New account request\n\nUsername: ${username}\nPassword: ${password}\nPromo Code: ${promo_code}\n\n${new Date(Date.now()).toUTCString()}`, this.registerInlineKYB.approveRejectKYB(request.id));
                await this.ctx.reply("Your account creation request is under review. You will be notified when it is approved.", this.registerKYB.removeKYB());
                await this.talker.talk();
                await this.talker.done();
            }else {
                const created = await account.create();
                const requestObj = new RequestC({account_id: created.id});
                const request = await requestObj.create();
                const notification = new Notification(this.ctx);
                const promocodeMessage = promo_code == undefined ? "No Promo Code" : `Promo Code: ${promo_code}`;
                await notification.sendToAdmin(`New account request\n\nUsername: ${username}\nPassword: ${password}\n${promocodeMessage}\n\n${new Date(Date.now()).toUTCString()}`, this.registerInlineKYB.approveRejectKYB(request.id));
                await this.ctx.reply("Your account creation request is under review. You will be notified when it is approved.", this.registerKYB.removeKYB());
                await this.talker.talk();
                await this.talker.done();
            }
        }catch (e:any) {
            this.ctx.reply("Something went wrong: " + e.message);
        }
    }
}