import * as otp from 'otp-generator';

export const generateOtp = (): number => {
  return otp.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};
