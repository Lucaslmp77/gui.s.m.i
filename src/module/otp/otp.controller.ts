import { Body, Controller, Get, HttpCode, InternalServerErrorException, Param, Post } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { OtpDTO } from "./otp.dto";

@Controller("api/otp")
export class OtpController {
    constructor(private otpService: OtpService) { }

    @Post()
    @HttpCode(201)
    async create(@Body() otpData: OtpDTO) {
        return this.otpService.sendOtp(otpData);
    }

    @Post("/verify")
    @HttpCode(200)
    async verifyOtp(@Body() body: { email: string; otp: string }) {
        return this.otpService.verifyOtp(body.email, body.otp);
    }

    @Post("/email-verification")
    @HttpCode(200)
    async sendVerificationOtpEmail(@Body() body: { email: string }) {
        return this.otpService.sendVerificationOtpEmail(body.email);
    }

    @Post("/email-verification/verify")
    @HttpCode(200)
    async verifyUserEmail(@Body() body: { email: string, otp: string }) {
        return this.otpService.verifyUserEmail(body.email, body.otp);
    }

}