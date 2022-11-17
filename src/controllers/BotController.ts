import {BotTalkersC} from "./BotTalkers";
import {Basic} from "../messages/Basic";
import {UsersC} from "./Users";
import {AdminC} from "./Admin";
import { Register } from "../messages/Register";
import {AccountC} from "./Account";
import {AccountM} from "../model/Account";
import {captchaStatus, Status} from "@prisma/client";
import {CaptchaC} from "./Captcha";
import { v4 as uuidv4 } from 'uuid';

export class BotController {
    private readonly ctx;
    private tuser: UsersC;
    private talker: BotTalkersC = new BotTalkersC({});
    private text;
    private chat;
    private readonly id;
    private readonly first_name;
    private readonly last_name;
    private readonly username;
    private basicMessages;
    private registerMessages;
    private isAdmin;
    constructor(ctx:any) {
        this.ctx = ctx;
        this.text = ctx.message.text;
        this.chat = ctx.message.chat;
        this.id = this.chat.id;
        this.first_name = this.chat.first_name;
        this.last_name = this.chat.last_name;
        this.username = this.chat.username;
        this.tuser = new UsersC({
            tg_id: this.chat.id.toString(),
            fname: this.chat.first_name,
            lname: this.chat.last_name,
            username: this.chat.username
        });
        this.basicMessages = new Basic(this.ctx);
        this.registerMessages = new Register(this.ctx);
        this.isAdmin = false;
    }

    async handleText() {
        try {
            const userObj = new UsersC({tg_id: this.id.toString()});
            const user_id = await userObj.getID();
            userObj.id = user_id;
            if (user_id == 0) {
                await this.welcome();
            } else {
                if (await userObj.isActive()) {
                    const admin = new AdminC({user_id: user_id});
                    this.isAdmin = (await admin.exists());
                    if (!(await this.checkAccount(user_id)) || this.text == "/admin") {
                        this.talker.user_id = user_id;
                        this.text = this.text[0] == '/' ? this.text.slice(1) : this.text;
                        if (await this.talker.isWaiting()) {
                            await this.watch();
                        } else {
                            await this.handleRequest();
                        }
                    }
                } else {
                    await this.captcha();
                }
            }
        } catch (e:any) {
            this.ctx.reply("This feature is not available yet or is bugged. Please contact support" + e);
        }
    }
    async watch() {
        try {
            if (this.text == "start" || this.text == "restart") {
                await this.back("menu");
                return true;
            }
            switch (await this.talker.getCurrent()) {
                case "register_username":
                    await this.registerMessages.askPassword();
                    break;
                case "register_password":
                    switch (this.text) {
                        case "🔙 Back":
                            await this.back("username");
                            break;
                        default:
                            await this.registerMessages.askConfirmPassword();
                    }
                    break;
                case "register_confirm_password":
                    switch (this.text) {
                        case "🔙 Back":
                            await this.back("password");
                            break;
                        default:
                            await this.registerMessages.askPromoCode();
                    }
                    break;
                case "register_promo_code":
                    switch (this.text) {
                        case "🔙 Back":
                            await this.back("password");
                            break;
                        default:
                            await this.registerMessages.process();
                    }
                    break;
                default:
                    await this.basicMessages.unknownCommand();
                    break;
            }
        } catch (e:any) {
            console.log(e);
            await this.basicMessages.unknownCommand();
        }
    }
    async handleRequest() {
        switch (this.text) {
            case 'start':
            case 'restart':
                await this.captcha();
                break;
            case 'admin':
                if (process.env.NODE_ENV == "development") {
                    const admin = new AdminC({
                        name: process.env.ADMIN_NAME,
                        username: process.env.ADMIN_USERNAME,
                        password: process.env.ADMIN_PASSWORD,
                        user_id: parseInt(process.env.ADMIN_ID ?? '0')
                    });
                    admin.create().then(() => {
                        this.ctx.reply("Admin created");
                    }).catch((e:any) => {
                        if (e.message.includes("unq_admin_name")) {
                            this.ctx.reply("Admin already exists");
                        }else {
                            this.ctx.reply("Admin not created due to error");
                        }
                    });
                }else {
                    await this.basicMessages.unknownCommand()
                }
                break;
            default:
                await this.basicMessages.unknownCommand();
                break;
        }
    }
    async welcome() {
        const tuser = await this.tuser.create();
        await this.basicMessages.welcome();
        await this.captcha();
    }
    async checkAccount(user_id:number) {
        if (this.isAdmin) {
            await this.basicMessages.heyAdmin();
            return true;
        }else {
            const account = new AccountC({user_id: user_id});
            const checker = await account.getID()
            if (checker) {
                account.id = checker;
                console.log(checker);
                const acc = await account.get();
                if (acc.status == Status.ACTIVE) {
                    await this.basicMessages.alreadyRegistered();
                    return true;
                }
                else if (acc.status == Status.UNACTIVE) {
                    await this.basicMessages.underReview();
                    return true;
                } else if (acc.status == Status.BANNED) {
                    await this.basicMessages.accountBlocked();
                    return true;
                }else if (acc.status == Status.COLD) {
                    return false;
                }else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    async back(to:string) {
        if (to == "username") {
            await this.registerMessages.askUsername();
        }
        else if (to == "password") {
            const pre:string[] | undefined = (await this.talker.getPrevious())?.split(",");
            this.talker.previous = pre?.[0];
            this.talker.current = "register_password";
            await this.talker.talk();
            await this.registerMessages.passwordMessage();
        }
        else if (to == "promo_code") {
            const pre:string[] | undefined = (await this.talker.getPrevious())?.split(",");
            this.talker.previous = `${pre?.[0]},${pre?.[1]}`;
            this.talker.current = "register_promo_code";
            await this.talker.talk();
            await this.registerMessages.promoCodeMessage();
        }
        else {
            throw new Error("Unknown back to command");
        }
    }
    async handleFiles(){
        await this.basicMessages.unknownCommand();
    }
    async handlePictures() {
        await this.basicMessages.unknownCommand();
        // this.ctx.reply(`<code>${this.ctx.message.photo[this.ctx.message.photo.length - 1].file_id}</code>`, {parse_mode: "HTML"});
    }
    async captcha() {
        const userObj = new UsersC({tg_id: this.id.toString()});
        const user_id = await userObj.getID();
        userObj.id = user_id;
        const id = uuidv4();
        const captchaObj = new CaptchaC({user_id: user_id,captcha: id});
        if (!(await userObj.isActive())) {
            if (!(await captchaObj.exists())) {
                const captcha = await captchaObj.create();
                await this.ctx.reply("Please solve the captcha below to continue", {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Solve Captcha", url: `${process.env.CAPTCHA_URL}/captcha/${id}`}]
                        ],
                        resize_keyboard: true,
                        parse_mode: "HTML"
                    }
                })
            } else {
                captchaObj.id = await captchaObj.getID();
                const captcha = await captchaObj.get();
                if (captcha.status == captchaStatus.UNSOLVED) {
                    await this.ctx.reply("Please solve the captcha below to continue", {
                        reply_markup: {
                            inline_keyboard: [
                                [{text: "Solve Captcha", url: `${process.env.CAPTCHA_URL}/captcha/${captcha.captcha}`}]
                            ],
                            resize_keyboard: true,
                            parse_mode: "HTML"
                        }
                    })
                }
            }
        } else {
            if (!this.isAdmin) {
                await this.registerMessages.askUsername();
            }
        }
    }

}