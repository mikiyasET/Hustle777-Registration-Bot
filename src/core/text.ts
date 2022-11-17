import {BotController} from "../controllers/BotController";
const onText = (bot:any) => {
    try {
        bot.on('text', async (ctx: any) => {
            const bc = new BotController(ctx);
            await bc.handleText();
            return true;
        });
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export = {onText}