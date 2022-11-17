import {MenuKYB} from "../keyboards/normal/Menu";
import {BotTalkersC} from "../controllers/BotTalkers";

export class Basic {
    private readonly ctx;
    private talker;
    constructor(ctx:any) {
        this.ctx = ctx;
        this.talker = new BotTalkersC({});
    }

    async welcome() {
        const {id, first_name, last_name, username} = this.ctx.message.chat;
        this.ctx.reply(`<b>Hello there 👋🏼, Welcome!</b>\n\nAll messages are encrypted by telegram.`, {parse_mode: "HTML"})
    }

    async alreadyRegistered() {
        if (this.ctx.message.text == '/start' || this.ctx.message.text == '/restart') {
            await this.ctx.reply(`You are already registered!`);
        }else {
            await this.unknownCommand();
        }
    }
    async underReview() {
        await this.ctx.reply("Your account is under review. Please wait for the admin to approve your account.");
    }
    async accountBlocked() {
        await this.ctx.reply("Your account is blocked.");
    }
    async underConstruction() {
        await this.ctx.reply("This feature is under construction. Please try again later.")
    }
    async unknownCommand() {
        await this.ctx.reply("Sorry, I don't understand what you mean. Please try again.");
    }
    async heyAdmin() {
        await this.ctx.reply("Hey Admin!");
    }
}