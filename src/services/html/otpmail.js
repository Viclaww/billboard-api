export const otpMail = (otp) => {
  return `

      <div style="margin:0 auto; width:50%; text-align:text-center; color:white;">
         <div style="margin:20px auto 0; width:40%;"><img src="cid:billboardlogo" style="margin:0 auto;"  alt="bill pics" /></div>
        <div style="margin:20px auto 0; bacground:black; width:40%;">
          <img src="cid:postbox" style="margin:0 auto;"  alt="" />
        </div>
        <div style="background-color: #66B3FF; padding: 25px; color:white; text-align:center; ">
          <h3 style="color:white;">Here is your one time password <br />OTP to reset your password</h3>
          <h2>${otp}</h2>
          <button>Copy number</button>
        </div>
        <div style="display:-webkit-flex;  margin:0 auto;">
          <div>FAQ</div>
          <div>Contact us</div>
          <div>Our page</div>
        </div>
      </div>
  `;
};
