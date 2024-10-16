export const otpMail = (otp) => {
  return `
  <html>
    <head>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border: 2px solid black;
          min-height: 100vh;
          margin: 0;
        }
        .container > img {
          height: 100px;
          width: 100px;
          padding-bottom: 100px;
        }
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .mailbox > img {
          height: 100px;
          margin-top: 2px;
        }
        .content {
          border: 1px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-bottom: 30px;
          background-color: rgba(12, 147, 236, 0.726);
          height: 50vh;
          color: rgba(218, 193, 147, 0.295);
        }
        p {
          text-decoration: underline;
          display: flex;
          justify-content: center;
          color: white;
          height: 50px;
          font-size: 35px;
        }
        button {
          background-color: rgba(0, 0, 255, 0.616);
          height: 50px;
          width: 200px;
          border-radius: 20px;
          border: none;
          margin-left: 110px;
          color: rgb(171, 208, 218);
          text-transform: capitalize;
          text-decoration: solid;
        }
        h1 {
          color: white;
        }
        .footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 100px;
          color: rgb(156, 151, 151);
          margin: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="cid:billboardlogo" alt="bill pics " /><br />

        <div class="mailbox">
          <img src="cid:postbox" alt="" />
        </div>
        <div class="content">
          <h1>Here is your one time password <br />OTP to reset your password</h1>
          <p>${otp}</p>
          <button>Copy number</button>
        </div>

        <div class="footer">
          <div class="p">FAQ</div>
          <div class="p">Contact us</div>
          <div class="p">Our page</div>
        </div>
      </div>
    </body>
  </html>
  `;
};
