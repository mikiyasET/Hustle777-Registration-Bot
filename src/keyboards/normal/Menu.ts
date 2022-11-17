export class MenuKYB {
    private ctx: any;
    constructor(ctx:any) {
        this.ctx = ctx;
    }


    userMenuKYB = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: "💵  Deposit"}, {text: "💸 Withdraw"}],
                ],
                    resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    adminMenuKYB = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: "💵  Deposit"}, {text: "💸 Withdraw"}],
                ],
                    resize_keyboard: true
            },
            parse_mode: "HTML"
        }
    }
    doneKYB = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: "Done"}],
                ],
                resize_keyboard: true,
            },
            parse_mode: "HTML"
        };
    }
    cancelKYB = () => {
        return {
            reply_markup: {
                keyboard: [
                    [{text: "Cancel"}],
                ],
                resize_keyboard: true,
            },
            parse_mode: "HTML"
        };
    }

}