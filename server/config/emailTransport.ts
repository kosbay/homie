import * as path from "path";

const EMAIL_DIR = path.resolve(__dirname, "..", "helpers/email-templates");

export default {
  transport: {
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "support@secondcompany.nl",
      pass: "Seriously?"
    }
  },
  devTransport: {
    streamTransport: true,
    newline: "unix",
    buffer: true
  },
  emailtemplatesConfig: {
    message: {
      from: "Second Company<support@secondcompany.nl>"
    },
    send: true,
    views: {
      root: EMAIL_DIR,
      options: {
        extension: "ejs"
      }
    }
  }
};
