import {CaptchaC} from "./controllers/Captcha";
import {captchaStatus} from "@prisma/client";
import {UsersC} from "./controllers/Users";
import {Notification} from "./controllers/Notification";
import {BotTalkersC} from "./controllers/BotTalkers";
const expressLayouts = require('express-ejs-layouts');

const {onCallback} = require("./core/callback");
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');
const {onText} = require("./core/text");
const {verify} = require('hcaptcha');
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const SECRET = process.env.HCAPTCHA_SECRET_KEY;
const PORT = process.env.PORT || 8080;
const app = express();
if (onText(bot)) {

}else if (onCallback(bot)) {

}
bot.launch();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);

app.post('/v/:token', (req:any, res:any) => {
    // bot.telegram.sendMessage(req.params.user, `Hello`);
    const token = req.body['h-captcha-response'];
    verify(SECRET, token)
    .then(async (data: any) => {
        if (data.success === true) {
            const captcha_id = req.params.token;
            const captchaObj = new CaptchaC({captcha: captcha_id});
            if (await captchaObj.validateCaptcha()) {
                const captcha = await captchaObj.getByCaptcha();
                captchaObj.id = captcha.id;
                if (!(await captchaObj.isSolved())) {
                    await captchaObj.solve();
                    const userObj = new UsersC({id: captcha.user_id});
                    if (await userObj.check()) {
                        const user = await userObj.Activate();
                        await bot.telegram.sendMessage(user.tg_id, "Your account has been activated");
                        const talker = new BotTalkersC({user_id: user.id})
                        await talker.gets(user.tg_id);
                        talker.previous = await talker.getCurrent();
                        talker.current = "register_password";
                        await talker.talk();
                        await bot.telegram.sendMessage(user.tg_id, "Please choose your password");
                    }
                }
                res.render('success',{layout: false});
            }else {
                res.render('failure',{layout: false});
            }
        } else {
            res.render('failure',{layout: false})
        }
    })
    .catch((err:any) => {
        console.log(err);
        res.render('failure',{layout: false})
    });
});
app.get('/captcha/:captcha', async (req: any, res: any) => {
    const captcha_id = req.params.captcha;
    const captchaObj = new CaptchaC({captcha: captcha_id});
    if (await captchaObj.validateCaptcha()) {
        const captcha = await captchaObj.getByCaptcha();
        if (captcha.status == captchaStatus.UNSOLVED) {
            res.render('index', {captcha_id: captcha_id, valid: true});
        } else {
            res.render('index', {captcha: captcha_id, valid: false});
        }
    } else {
        // show 404 page
        res.status(404).render('404',{layout: false});
    }
});
app.get('/success', (req: any, res: any) => {
    res.render('success',{layout: false});
});
app.get('/failure', (req: any, res: any) => {
    res.render('failure',{layout: false});
});
// else show 404 page
app.get('*', (req: any, res: any) => {
    res.status(404).render('404',{layout: false});
});
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
