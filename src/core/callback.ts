import {RequestC} from "../controllers/Request";
import {UsersC} from "../controllers/Users";
import {AdminC} from "../controllers/Admin";
import {AccountC} from "../controllers/Account";

const onCallback = (bot:any) => {
    bot.on('callback_query', async (ctx:any) => {
        try {
            const {id, data, message,chat_instance} = ctx.callbackQuery;
            const {chat, message_id, text} = message;

            // ctx.answerCbQuery("Hey",{ show_alert: true })

            if (data == 'alert') {
                ctx.answerCbQuery("Hey", {show_alert: true})
            }
            else if (data.startsWith("regRequest")) {
                const user = new UsersC({tg_id: chat.id.toString()});
                const user_id = await user.getID();
                const admin = new AdminC({user_id: user_id});
                const isAdmin = (await admin.exists());
                if (isAdmin) {
                    const x = data.split("_");
                    const id = parseInt(x[2]);
                    if (x[1] == "yes") {
                        const req = new RequestC({id: id});
                        const request = await req.get();
                        await req.accept();
                        const accountObj = new AccountC({id: request.account_id});
                        await accountObj.activate();
                        const account = await accountObj.get();
                        ctx.answerCbQuery("Confirmed");
                        let edited = text.replace("New account request", "✅ Account Confirmed")
                        edited = `${edited.split("|")[0]}| <code>${edited.split("|")[1]}</code> |${edited.split("|")[2]}`
                        ctx.deleteMessage(message_id);
                        ctx.reply(edited, {parse_mode: "HTML"});
                        const User = new UsersC({id: account.user_id});
                        ctx.telegram.sendMessage(await User.getTgID(), "<b>Congratulations!!</b>\n\nYour account has been reviewed and created.", {parse_mode: "HTML"});
                    } else {
                        const req = new RequestC({id: id});
                        ctx.answerCbQuery("Rejected");
                        let edited = text.replace("New account request", "❌ Account Rejected");
                        edited = `${edited.split("|")[0]}${edited.split("|")[2]}`
                        ctx.deleteMessage(message_id);
                        ctx.reply(edited, {parse_mode: "HTML"});
                        const request = await req.delete();
                        const accountObj = new AccountC({id: request.account_id});
                        const accounts = await accountObj.delete();
                        const User = new UsersC({id: accounts.user_id});
                        ctx.telegram.sendMessage(await User.getTgID(), "<b>Request rejected!</b>\n\nYour account request has been rejected.\n<i>Please try again type /start to try again.</i>", {parse_mode: "HTML"});

                    }
                } else {
                    ctx.answerCbQuery("You are not authorized", {show_alert: true});
                }
            }
        }
        catch (e:any) {
            console.log("Error: " + e.message);
        }
        return true;
    });
    return false;
}

export = {onCallback}