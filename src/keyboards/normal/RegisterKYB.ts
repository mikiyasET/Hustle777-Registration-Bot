export class RegisterKYB {
    private ctx: any;

    constructor(ctx: any) {
        this.ctx = ctx;
    }
    backKYB = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: "🔙 Back"}],
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }
    }
    cancelKYB = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: "Cancel"}],
                    [{text: "🔙 Back"}]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            },
            parse_mode: "HTML"
        };
    }
    noPromoKYB = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: "Skip"}],
                    [{text: "🔙 Back"}]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            },
            parse_mode: "HTML"
        };
    }
    removeKYB = () => {
        return {
            reply_markup: {
                remove_keyboard: true
            }
        };
    }
}