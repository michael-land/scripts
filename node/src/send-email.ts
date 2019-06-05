import Email from "email-templates";
import dotenv from "dotenv";
import newWebsiteLaunch from "./emails/new-website-launch";
import mysql from "mysql";

dotenv.config();

const emailClient = new Email({
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

const mysqlConnection = mysql.createConnection({
  database: process.env.WOOCOMMERCE_DB_DATABASE,
  host: process.env.WOOCOMMERCE_DB_HOST,
  password: process.env.WOOCOMMERCE_DB_PASSWORD,
  user: process.env.WOOCOMMERCE_DB_USERNAME
});

(async () => {
  mysqlConnection.connect();

  await newWebsiteLaunch({ mysqlConnection, emailClient });
})()
  .then(() => {
    console.log("Task Complete Successful");
  })
  .catch(error => {
    console.log("Task Interrept.");
    console.log(error);
  })
  .finally(() => {
    mysqlConnection.end();
  });
