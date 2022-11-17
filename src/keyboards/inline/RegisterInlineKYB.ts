export class RegisterInlineKYB {
    private ctx: any;

    constructor(ctx: any) {
        this.ctx = ctx;
    }
    approveRejectKYB = (id:any) => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Confirm", callback_data: `regRequest_yes_${id}`},{text: "Reject", callback_data: `regRequest_no_${id}`}]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            },
            parse_mode: "HTML"
        };
    }
}