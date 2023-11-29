import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { compare, hash } from "bcryptjs";
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


    async sendOtp(data: OtpDTO) {
        const { AUTH_EMAIL } = process.env;
        try {
            if (!(data.email && data.subject && data.message)) {
                throw Error("Provide values for email, subject, message")
            }

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

            const generateOtp = await this.generateOtp();

            const mailOptions = {
                from: AUTH_EMAIL,
                to: data.email,
                subject: data.subject,
                html: `<p>${data.message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;">
                <b>${generateOtp}</b></p><p>Esse código <b>expira em ${data.duration} minuto(s)</b>.</p>`,
            }

            await this.sendEmail(mailOptions);

            const hashedOtp = await hash(generateOtp, 8);

            const createdAt = new Date().toISOString();

            return await this.prisma.otp.create({
                data: {
                    email: data.email,
                    otp: hashedOtp,
                    createdAt: createdAt,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                }
            });

        } catch (error) {
            throw error;
        }
    }

    async verifyOtp(email: string, otp: string) {
        try {
            if (!(email && otp)) {
                throw Error("Provide values for email, otp");
            }

            const matchedOtpRecord = await this.prisma.otp.findUnique({
                where: {
                    email: email,
                }
            });

            if (!matchedOtpRecord) {
                throw Error("No otp records found");
            }

            const { expiresAt } = matchedOtpRecord;

            if (expiresAt.getTime() < Date.now()) {
                throw Error("Code has expired. Request for a new one")
            }

            const hashedOtp = matchedOtpRecord.otp;
            return await compare(otp, hashedOtp);

        } catch (error) {
            throw error;
        }
    }

    async deleteOtp(email: string) {
        try {
            return this.prisma.otp.delete({
                where: {
                    email: email,
                }
            });

        } catch (error) {
            throw error;
        }
    }

    async sendVerificationOtpEmail(email: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    email: email,
                }
            });

            if (!existingUser) {
                throw Error("Theres no account for the provided email")
            }

            const otpDetails: OtpDTO = {
                email,
                subject: "Verificação de email",
                message: "Verifique seu email com o seguinte código",
                duration: 5,
            }

            return await this.sendOtp(otpDetails);

        } catch (error) {
            throw error;
        }
    }

    async verifyUserEmail(email: string, otp: string) {
        try {

            if (!(email && otp)) {
                throw Error("Empty otp details are not allowed");
            }

            const validOtp = await this.verifyOtp(email, otp);
            if (!validOtp) {
                throw Error("Invalid code passed. Check your inbox")
            }

            await this.prisma.user.update({
                where: {
                    email: email,
                },
                data: {
                    verified: true,
                },
            });

            return await this.deleteOtp(email);

        } catch (error) {
            throw error;
        }
    }
}