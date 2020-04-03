const RegisterValidator = require("../validators/register_validator");
const LoginValidator = require("../validators/login_validator");
const MailService = require('../services/mail_sevice');

const con = require('../engine/db_connect');

class UserData {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.phone = user.phone;
        this.user_type = user.user_type;
    }
}

module.exports = class AuthController {

    static signUp(req, res) {
        const validator = new RegisterValidator(req);
        let query = '';

        if (validator.fails()) {
            return res.status(422).json({
                message: "Some validation error occurred!",
                errors: validator.errors().all()
            });
        }
        const validated = validator.validated;

        // check email exist

        query = `SELECT * FROM users where email = '${validated.email}'`;
        con.query(query, function (err, result) {
            if (err) {
                throw err;
            }
            console.log("Result: " + result);

            if (result.length === 0) {

                // create new user record

                query = `INSERT INTO users (first_name,last_name,email,password,phone,user_type)
                       VALUES ('${validated.firstName}', 
                               '${validated.lastName}', 
                               '${validated.email}', 
                               '${validated.password}', 
                               '${validated.phone}',
                                ${validated.userType})`;
                con.query(query, function (err, result) {
                    if (err) throw err;
                    console.log("Result: " + result);
                    return res.json({
                        message: "Sign up Successful!",
                    });
                });
            } else {
                return res.status(422).json({
                    message: "Email already in use!",
                    errors: {email: ["Email already in use!"]}
                });
            }
        });
    }

    static login(req, res) {
        const validator = new LoginValidator(req);
        let query = '';

        if (validator.fails()) {
            return res.status(422).json({
                message: "Some validation error occurred!",
                errors: validator.errors().all()
            });
        }
        const validated = validator.validated;

        query = `SELECT * FROM users where email = '${validated.email}' AND password = '${validated.password}'`;
        con.query(query, function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length === 1) {
                const otp = Math.floor(1000 + Math.random() * 9000);
                query = `UPDATE users SET otp = ${otp} WHERE id = ${result[0].id}`;
                con.query(query, function (err) {
                    if (err) throw err;
                    let mailObject = {
                        email: result[0].email,
                        otp
                    };
                    MailService.sendVerificationMail(mailObject).then(r => {
                        console.log('res', r);
                        return res.json({
                            message: "OTP mail sent successfully",
                            data: new UserData(result[0])
                        });
                    });
                });
            } else {
                return res.status(422).json({
                    message: "Credentials are incorrect, please try again.",
                });
            }
        });
    }
};
