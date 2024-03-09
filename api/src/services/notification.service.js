const path = require('path');
const fs = require('fs');
const mail = require('../infrastructure/mail');
const ejs = require('ejs');
const { HttpStatusCode } = require('../common/constants');

const EJS_TEMPLATE_PATH =  path.join(__dirname, '../common/templates');

exports.sendEmailVerification = async (template_data) => {
    const template = 'account_signup_email';
    const subject = 'WRAP - New account signup confirmation';
    await send_notification(template_data.email, subject, template, template_data);
}

exports.sendEmailHasBeenVerified = async (template_data) => {
    const template = 'account_email_verified';
    const subject = 'WRAP - Your email address has been verified';
    await send_notification(template_data.email, subject, template, template_data);
}

exports.sendPasswordResetEmail = async (template_data) => {
    const template = 'password_reset_email';
    const subject = 'WRAP - You have requested to reset your account login';
    await send_notification(template_data.email, subject, template, template_data);
}

/**
 * Process the template with data and send the email notifications 
 * @param {Array<string>} recipients - list of email recipients
 * @param {string} template - template file name *.ejs
 * @param {Json} template_data - JSON object with name/value pairs for interpolation
 */
const send_notification = async (recipient, subject, template, template_data) => {
    const templateFile = path.join(EJS_TEMPLATE_PATH, `${template}.ejs`);
    template_data.SITE_URL = process.env.SITE_URL;

    try {
        await fs.promises.access(templateFile, fs.constants.F_OK);
        const messageBody = await ejs.renderFile(templateFile, template_data);
        await mail.send(process.env.NO_REPLY_EMAIL, recipient, subject, messageBody);
    } catch (error) {
        const err = new Error('An error has occurred while sending notification', { cause: error });
        err.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        throw err;
    }
}
