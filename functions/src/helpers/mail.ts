import * as AWS from "aws-sdk";
import { template } from "./template";
import * as dotenv from "dotenv";
import * as express from "express";
import { db } from "../config/admin";
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });
interface WelcomeEmailData {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  profilePic: string;
}
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

  // mailToProductManagerFromSeller(to:string,message:string,data:object){

  // }
  static createTemaplate(req: any, res: express.Response) {
    //TODO:This template for welcome email
    var params = {
      Template: {
        TemplateName: "WELCOME_EMAIL_ECOM",
        HtmlPart: `<div>
        <div style="display=flex;justify-content:center">
        <h3>Hello,<strong>{{firstName}} {{lastName}}</strong> Welcome to a board 🏘️</h3>
        <br/>
        <p>Your email address {{email}} kindly you will recieve all updates to this account.</p>
        <p>Use this email address for login into your account</p>
        <p>We hope everything is ok upto now. Thank you for signing up,we will always be with you </p>
        
        </div>
        <div style="display:grid;align-items:bottom">
        <p>Regards,</p>
        <p>Team ECOM</p>
        </div>
        </div>`,
        SubjectPart: "Welcome to a board",
        TextPart:
          "Hello{{firstName}} {{lastName}},\r\n Your email address{{email}}\n kindly you will recieve all updates to this account",
      },
    };
    const createTemplate = ses.createTemplate(params).promise();
    createTemplate
      .then((data) => {
        console.log(data);
        return res
          .status(200)
          .json({ message: "Template created successfully" });
      })
      .catch((err) => {
        return res.status(400).json({ error: err });
      });
  }
  static sendTemplateEmail(mailObj: WelcomeEmailData) {
    const templateData = JSON.stringify({
      firstName: mailObj.firstName,
      lastName: mailObj.lastName,
      email: mailObj.email,
    });
    const params = {
      Source: "webapp.ecom@gmail.com",
      Template: "WELCOME_EMAIL_ECOM",
      ConfigurationSetName: "ecom-emails",
      Destination: {
        ToAddresses: [mailObj.email],
      },
      TemplateData: templateData,
    };
    return ses.sendTemplatedEmail(params, (err, info) => {
      if (err) {
        const mailRef = db
          .collection("MAILS")
          .doc()
          .collection("FAILED-INVOCATION")
          .doc();
        return mailRef
          .set({
            ...mailObj,
            errorObject: {
              ...err,
            },
            status: "Failed",
            isMailSent: false,
          })
          .then((info) => {
            return info.writeTime;
          })
          .catch((err) => {
            return err;
          });
      } else {
        const mailRef = db
          .collection("MAILS")
          .doc()
          .collection("SUCCESS-INVOCATION")
          .doc();
        return mailRef
          .set({
            ...mailObj,
            ...info,
            isMailSent: true,
          })
          .then((info) => {
            return info.writeTime;
          })
          .catch((err) => {
            return err;
          });
      }
    });
  }
}
export default SendMails;
