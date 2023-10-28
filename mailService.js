const nodemailer = require('nodemailer')
const {google} = require('googleapis')

const CLIENT_ID = '491899038443-ck72imqt4pv1k45u5ste9b2n2tf9dagg.apps.googleusercontent.com'
const CLIENT_SECRET= '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'
const REDIRECT_URI= 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN= '1//04ziOJDkVu8DaCgYIARAAGAQSNwF-L9IrxU-DNtIcDwpNZQbB93kGjJIuYr0itG_Pm5xs4mBKKAcLnF3TLSEMeDNMhFbsWkW2wGA'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})


exports.sendEmail = async(email, link) => {

    const mailOptions = {
        from: "Fakturiko Team",
        to: email,
        subject: "Pass reset",
        text: `Click on the link: + "" + ${link}`,
        html:`<h1>Pass reset Link</h1>
               <p>Press the link below</p>
               <p>${link}</p>`
    }

    try {

        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "ana.popova.register@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })


        const result = await transport.sendMail(mailOptions)
        return result
        
    } catch (error) {
        console.log(error.message)

        
    }

}

