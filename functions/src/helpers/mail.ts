import * as AWS from "aws-sdk";
import { template } from "./template";
import * as dotenv from "dotenv";

dotenv.config();
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

class SendMails {
  mailToForgotPassword(
    to: string,
    subject: string,
    body: string,
    resetLink: string
  ) {
    const content = { resetLink };
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      ConfigurationSetName: "ecom-emails",
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: template(content),
          },
          Text: {
            Charset: "UTF-8",
            Data: body,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: "webapp.ecom@gmail.com",
    };

    return ses.sendEmail(params).promise();
  }
}
export default SendMails;
