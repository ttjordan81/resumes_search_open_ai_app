const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ region: process.env.AWS_REGION || "us-gov-west-1" });

/**
 * Email sender
 * @param {string} fromAddress - sender email
 * @param {string} toAddress - a semicolon delimited list of email addresses
 * @param {string} subject 
 * @param {string} messageBody 
 * @returns 
 */
exports.send = async (fromAddress, toAddress, subject, messageBody) => {
    const sendEmailCommand = createSendEmailCommand(toAddress, fromAddress, subject, messageBody);
    return await sesClient.send(sendEmailCommand);
};

/**
 * Builds the AWS SDK SendEmailCommand object for sending email
 * @param {string} toAddress - a semicolon delimited list of email addresses
 * @param {string} fromAddress - sender email
 * @param {string} subject 
 * @param {string} messageBody 
 * @returns SendEmailCommand
 */
const createSendEmailCommand = (toAddress, fromAddress, subject, messageBody) => {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: toAddress.replace(' ', '').split(';'),
            CcAddresses: [ /* more items */ ],
        },
        Message: {
            Body: {
                Html: { 
                    Charset: "UTF-8",
                    Data: messageBody,
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject
            }
        },
        Source: fromAddress,
        ReplyToAddresses: [ /* more items */ ],
    });
};