import {VERIFICATION_EMAIL_TEMPLATE} from "./template/AuthVerificationTemplate";
import {transporter} from "./mailer";
import {ErrorResponse} from "../utils/ErrorResponse";
import {MailOptions} from "nodemailer/lib/smtp-pool";

export const sendEmail =  async (options: MailOptions) => {
        try {
            transporter.sendMail(options, (err, info) => {
                if (err){
                    console.log("Error sending verification email : ", err);
                    throw new ErrorResponse("Error sending verification email", 500);
                }else {
                    console.log("Email sent: "+ info.response);
                }
            })
        } catch (error) {
            console.error(`Error sending verification`, error);

            throw new Error(`Error sending verification email: ${error}`);
        }
    };