const Transporter = require('../engine/mail');
const handlebars = require('handlebars');
const fs = require('fs');

module.exports = class MailService {
    static async sendVerificationMail(user) {
        let html = fs.readFileSync(__dirname + '/../resources/authentication_mail_template.html', "utf8");
        let template = handlebars.compile(html);
        return Transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: user.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: template(user)
        }).then((r) => {
            console.log('template', r);
            return 'mail sent'
        })
    }
}
