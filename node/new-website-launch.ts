import Email from "email-templates";
import dotenv from "dotenv";

(async () => {
  dotenv.config();

  const receiptions = getReceiptions().join(",");

  const email = new Email({
    message: {
      from: `"J-Tech Digital" <support@jtechdigital.com>`
    },
    send: true,
    preview: false,
    transport: {
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GODADDY_EMAIL_USER,
        pass: process.env.GODADDY_EMAIL_PASS
      }
    }
  });

  getReceiptions().map(receiption => {
    email
      .send({
        template: "new-website-launch",
        locals: { username: receiption.username },
        message: { to: receiption.email }
      })
      .catch(console.error);
  });
})();

function getReceiptions() {
  const receiptions = [
    { username: "Michael", email: "lxyamerica@gmail.com" },
    { username: "Michael", email: "xiaoyu.tamu@hotmail.com" },
    { username: "Jason", email: "jasonkou@gmail.com" },
    { username: "Jeff", email: "junwa@hotmail.com" }
  ];

  return receiptions;
}
