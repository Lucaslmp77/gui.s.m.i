import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { hash } from "bcryptjs";
import { OtpDTO } from "./otp.dto";
const nodemailer = require("nodemailer");

@Injectable()
export class OtpService {
    constructor(private prisma: PrismaService) { }

    async generateOtp() {
        try {
            const otp: string = `${Math.floor(1000 + Math.random() * 9000)}`;
            return otp;
        } catch (error) {
            throw error;
        }
    }

    async sendEmail(mailOptions) {
        const { AUTH_EMAIL, AUTH_PASS } = process.env;

        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            auth: {
                user: AUTH_EMAIL,
                pass: AUTH_PASS,
            },
        });

        transporter.verify((error, success) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Ready for messages");
                console.log(success);
            }
        });

        try {
            return await transporter.sendMail(mailOptions);
        } catch (error) {
            throw error;
        }
    }


    async sendOtp(email, subject, message, duration = 1, data: OtpDTO) {
        const { AUTH_EMAIL } = process.env;
        try {
            if (!(email && subject && message)) {
                throw Error("Provide values for email, subject, message")
            }

            // Clear any old record
            const existingOtpRecord = await this.prisma.otp.findUnique({
                where: {
                    email: data.email,
                },
            });

            if (existingOtpRecord) {
                await this.prisma.otp.delete({
                    where: {
                        email: data.email,
                    },
                });
            }

            //generate pin
            const generateOtp = await this.generateOtp();

            //send email
            const mailOptions = {
                from: AUTH_EMAIL,
                to: email,
                subject,
                html: `<p>${message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;">
                <b>${generateOtp}</b></p><p>This code <b>expires in ${duration} minute(s)</b>.</p>`,
            }

            await this.sendEmail(mailOptions);

            //save otp record
            const hashedOtp = await hash(generateOtp, 8);

            const createdAt = new Date().toISOString();

            return await this.prisma.otp.create({
                data: {
                    email: data.email,
                    otp: hashedOtp,
                    createdAt: createdAt,
                    expiresAt: new Date(Date.now() + 3600000 * duration).toISOString(), // Também corrigi a formatação aqui
                }
            });

        } catch (error) {
            throw error;
        }
    }
}