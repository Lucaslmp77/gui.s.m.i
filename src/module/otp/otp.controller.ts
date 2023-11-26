import { Body, Controller, Get, HttpCode, InternalServerErrorException, Param, Post } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { OtpDTO } from "./otp.dto";

@Controller("api/otp")
export class OtpController {
    constructor(private otpService: OtpService) { }

    @Post()
    @HttpCode(201)
    async create(@Body() otpData: OtpDTO) {
        try {
            return this.otpService.sendOtp(otpData);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Internal server error");
        }
    }



}