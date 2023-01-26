import sgMail from '@sendgrid/mail';
import { env, mailSecret } from '../config/env';


sgMail.setApiKey(env.SEND_GRID_API_KEY || '');

export const sendMail = async (to: string, template_data: Object) => {
    const msg : sgMail.MailDataRequired = {
        from: env.MAIL_FROM || '',
        to,
        templateId: 'd-833fed7671dd49418bec05fbb9d7e79e',
        dynamicTemplateData: template_data,
    };
    try {
        await sgMail.send(msg);
    } catch  (error : any) {
        console.log(error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
}
