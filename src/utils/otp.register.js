export const generateOTPnumber = async (length, db) => {
  const min = Math.pow(4, length - 1);
  const max = Math.pow(4, length) - 1;
  let OTP;
  let exists = true;

  while (exists) {
    OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    const num = OTP.toString()
    const result = await db.findOne({ where: { OTP: num } });
    exists = !!result; // true if number exists
  }

  return OTP;
};