/*****************************************************************************************************************************
*
*     Name:                   Mail Functions Wrapper
*     Version:                 1.0
*     Description:             This is the javascript file having source code for sending mail to developer
*							 
* *****************************************************************************************************************************/
var nodemailer = require("nodemailer"); //Nodemailer is a module for Node. js applications to allow easy as cake email sending.


// Create the transporter with the required configuration for Gmail
// change the user and pass !
module.exports={

sendMail:function(msg){

  var transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true, // use SSL
      auth: {
          user: "smws@project.ortusolis.com",
          pass: "Smws#node@20"
      }
  });

  // setup e-mail data, even with unicode symbols
  var mailOptions = {
      from: "smws@project.ortusolis.com", // sender address (who sends)
      to: "rajat.naik@ortusolis.com", // list of receivers (who receives)
      subject: "Websocket Server/Gateway Device Error Message", // Subject line
      text: "msg", // plaintext body
      html: "<p>"+msg+"</p>" // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
         
         return;
      }

      
      return;
  });
  return;
  }

};