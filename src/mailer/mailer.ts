import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

const transportConfig: SMTPTransport.Options = {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!) || 587,
    secure: false, // raha hampiasa TLS (true for 465, false for other ports)
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
    },
};

export const transporter = nodemailer.createTransport(transportConfig);
export const mailOptions = (email:string, name:string, subject:string, category:string, htmlTemplate:string) => {
    return {
        from:  process.env.SMTP_HOST!,
        to: email,
        subject: subject,
        // text: `Hi ${name},\n\nYour account has been successfully created!\n\nBest Regards,\nYour Company`,
        html: htmlTemplate, //raha ohatra ka html no envoyer-na
        category: category,
    }
};
