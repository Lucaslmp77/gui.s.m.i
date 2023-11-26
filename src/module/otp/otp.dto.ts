export type OtpDTO = {
    email?: string;
    otp?: string;
    createdAt?: string;
    expiresAt?: string;
    subject?: string;
    message?: string;
    duration: number;
};
