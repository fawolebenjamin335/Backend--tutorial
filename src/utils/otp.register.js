import { User }  from "../models/user.js";



export const generateOTPnumber = async (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  let OTP;
  let exists = true;

  while (exists) {
    OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    const otpStr = OTP.toString();

    // Check if OTP already exists for any user
    const result = await User.findOne({ where: { OTP: otpStr } });
     exists = !!result; // true if number exists
  }

  return OTP;
}



// export const generateOTPnumber = async (length, db) => {
// const min = Math.pow(4, length - 1);
//   const max = Math.pow(4, length) - 1;

//   let OTP;
//   let exists = true;
//   while (exists) {
//     OTP = Math.floor(Math.random() * (max - min + 1)) + min;
//     const num = OTP.toString()
//     const result = await db.findOne({ where:  {OTP: num}  });
//     console.log(`The result is`, result);
//     exists = !!result; // true if number exists
//   }

//   return OTP;
// };














// export const generateOTPnumber = async (email) => {
//   const user = await User.findOne({ where: { email } });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   user.OTP = otp;
//   await user.save();

//   return otp;
// };


