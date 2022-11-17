import {BotController} from "../controllers/BotController";
const onPhoto = (bot:any) => {
    try {
        bot.on('photo', async (ctx: any) => {
            const bc = new BotController(ctx);
            await bc.handlePictures();

            return true;
        });
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export = {onPhoto}