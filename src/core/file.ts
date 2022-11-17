import {BotController} from "../controllers/BotController";

const onFile = (bot:any) => {
    try {
        bot.on('document', async (ctx: any) => {
            try {
                const bc = new BotController(ctx);
                await bc.handleFiles();
            } catch (e:any) {
                ctx.reply("Error: " + e.message.toString());
                console.log("Error: " + e.message);
            }
            return true;
        })
    } catch (e:any) {
        console.log(e);
    }
    return false;
}
export { onFile }