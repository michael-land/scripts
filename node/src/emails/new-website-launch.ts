import Email from "email-templates";
import path from "path";
import mysql from "mysql";
const TEMPLATE_PATH = path.join(
  __dirname,
  "email-templates",
  "new-website-launch"
);

export default function main(ctx: {
  emailClient: Email;
  mysqlConnection: mysql.Connection;
}) {
  ctx.mysqlConnection.query(
    `SELECT
      firstname_meta.meta_value as firstname,
      lastname_meta.meta_value as lastname,
      user_email
    FROM
      wp_users
      LEFT JOIN wp_usermeta as firstname_meta on firstname_meta.user_id = wp_users.ID
      and firstname_meta.meta_key = 'first_name'
      and firstname_meta.meta_value is not null
      LEFT JOIN wp_usermeta as lastname_meta on lastname_meta.user_id = wp_users.ID
      and lastname_meta.meta_key = 'last_name'
      and lastname_meta.meta_value is not null`,
    async function(error, results) {
      if (error) throw error;
      results.forEach(async (user: User) => {
        console.log(`email send to ${user.user_email}`);
        // skip spam user
        if (user.firstname.includes("http")) {
          return;
        }
        const fullname = `${user.firstname} ${user.lastname}`;

        if (fullname === "Jason Kou") {
          await ctx.emailClient
            .send({
              template: TEMPLATE_PATH,
              locals: { username: user.user_email, fullname },
              message: { to: "lxyamerica@gmail.com" }
            })
            .catch(console.error);
        }
      });
    }
  );
}

interface User {
  firstname: string;
  lastname: string;
  user_email: string;
}
