const { isNil } = require('lodash');
const nodemailer = require("nodemailer");

let instance = null;

class EmailService {
    async main(receiver, name, secretCode) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465, // 587
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'jankec994@gmail.com',
                pass: 'girasole94'
            },
        });

        await transporter.sendMail({
            from: 'BONES Group 👻 <bones.group@zohomail.eu>',
            to: receiver,
            subject: "Dobrodošli ✔",
            html: this.getTemplate(name, secretCode),
            attachments: [{
                filename: 'bonescosmetics.png',
                path: '../storage/UI/bonescosmetics.png',
                cid: 'logo'
            }]
        });
    }

    getTemplate(name, secretCode) {
        return `
            <html>

            <head>
                <title>Your account verification will be reviewed shortly</title>
            </head>

            <body>
            <div style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                text-align: center;
                color: #3C4455;
                font-size: 16px;
            ">
                <div style="
                    border-radius: 20px;
                    background-color: #fff;
                    box-shadow: 0px 5px 80px rgba(0, 0, 0, 0.03);
                    width: 100%;
                    padding: 50px 0;
                    max-width: 600px;
                    margin: 20px auto;
                ">
                    <div style="text-align: left; margin: 0 24px">
                        <img src="cid:logo" alt="BONES Group" />
                    </div>

                    <div style="text-align: left; margin: 40px 24px; width: calc(100% - 48px)">
                        <p style="margin-bottom: 25px">
                            Poštovani
                            <span style="color: #2d2d2d">${name},</span>
                        </p>
                        <p style="margin-bottom: 25px; line-height: 27px">
                            Radujemo se našoj budućoj saradnji.
                        </p>
                        <p style="margin-bottom: 25px; line-height: 27px">
                            U nastavku Vam prosleđujemo Vašu lozinku za prijavljivanje prilikom kreiranja narudžbina.
                        </p>
                        <h2 style="margin-bottom: 25px; line-height: 27px">
                            ${secretCode}
                        </h2>
                    </div>

                    <div style="text-align: left; margin: 0 24px; width: calc(100% - 48px)">
                        <p style="margin-bottom: 24px; font-size: 16px">
                            Srdačan pozdrav, 
                            <br>
                            BONES Group
                        </p>
                    </div>

                    <div style="text-align: left; margin: 40px 24px; width: calc(100% - 48px)">
                        <a href="http://localhost:4200/products-list">
                            <button style="
                                background: #4E8D6B;
                                box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
                                border-radius: 8px;
                                border: none;
                                color: #ffffff;
                                height: 55px;
                                padding: 0 24px;
                                cursor: pointer;
                                font-size: 14px;
                            ">
                                Pretražite našu ponudu
                            </button>
                        </a>
                    </div>

                    <div style="text-align: left; margin: 60px 24px 0 24px; ">
                        <p style="margin-bottom: 4px; font-size: 12px; color:#857272">
                            © 2022 BONES Group, Sva prava zadržana.
                        </p>
                        <p style="margin-bottom: 24px; font-size: 12px; color:#857272">
                            <i>Ovo je automatizovana poruka, <b>molimo Vas da ne odgovarate na ovaj emejl.</b> Hvala.</i>
                        </p>

                    </div>
                </div>
            </div>
            </body>

            </html>`
    }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new EmailService();
    }

    return instance;
})();