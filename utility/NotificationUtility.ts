// Email

// notification

// OTP

export const GenerateOtp = () => {

    const otp = Math.floor(100000 + Math.random() * 900000)

    let expiry = new Date()
    expiry.setTime( new Date().getTime() + (30 * 60 * 1000))

    return { otp, expiry }
}

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {

    const accountSid = 'AC6b37a4c72290e770bad82e0e6e0038e6'
    const authToken = 'd384426ba0b894cee85eae0c0fbb9c4f'
    const client = require('twilio')(accountSid, authToken);

    const response = await client.messages.create({
        body: `Your otp is ${otp}`,
        from: '+14693003550',
        to: `+91${toPhoneNumber}`
    })

    return response;
}
// Payment notfication or emails 