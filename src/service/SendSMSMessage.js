"use strict";
var AWS = require("aws-sdk");

/**
 * @param {String} originationNumber The phone number sending the message
 * @param {String} destinationNumber The phone number recieving the message
 * @param {String} message The message body
 * @param {String} registeredKeyword The registered keyword associated with the originating short code. (CONFIRM, HELP, STOP).
 * @returns {SendMessagesCommandOutput | undefined}
 */
function sendSMSMessage(originationNumber, destinationNumber, message, registeredKeyword){
  require('dotenv').config({path: (__dirname+'/../.env')});

  const {
    fromIni,
  } = require("@aws-sdk/credential-providers");
  
  const {
    Pinpoint,
  } = require("@aws-sdk/client-pinpoint");
  
  var aws_region = "us-east-2";
  var messageType = "TRANSACTIONAL"
  
  var credentials = fromIni({ profile: "default" });
  AWS.config.credentials = credentials;
  AWS.config.update({ region: aws_region });
  
  //Create a new Pinpoint object.
  var pinpoint = new Pinpoint({
    region: aws_region,
    credentials: credentials,
  });
  
  // Specify the parameters to pass to the API.
  var params = {
    ApplicationId: process.env.awsPinpointApplicationId,
    MessageRequest: {
      Addresses: {
        [destinationNumber]: {
          ChannelType: "SMS",
        },
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: message,
          Keyword: registeredKeyword,
          MessageType: messageType,
          OriginationNumber: originationNumber,
        },
      },
    },
  };
  let result = undefined;
  //Try to send the message.
  pinpoint.sendMessages(params, function (err, data) {
    // If something goes wrong, print an error message.
    if (err) {
      console.log(err.message);
      // Otherwise, show the unique ID for the message.
    } else {
      console.log(
        "Message sent! " +
          data["MessageResponse"]["Result"][destinationNumber]["StatusMessage"]
      );
      result = data["MessageResponse"]["Result"][destinationNumber]["StatusMessage"];
    }
  });
  return result;
}
//sendSMSMessage("+16812485790", "+15166559192", "Testing AWS Pinpoint in function form!", "STOP");

module.exports = sendSMSMessage;