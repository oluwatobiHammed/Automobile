
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SEND_GRID_APIKEY!)

const sendWelcomeEmail = (email: string,name?: string) => {
    sgMail.send({
        to: email,
        from:  process.env.FROM_EMAIL,
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
     })
}

const sendCancelationEmail = async (email: string,name?: string) => {
    sgMail.send({
        to: email,
        from:  process.env.FROM_EMAIL,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
     })
}


export { sendWelcomeEmail,sendCancelationEmail}
