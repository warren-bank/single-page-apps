(function(){

  const get_OTP = (key_uri) => {
    if (!OTPAuth || !OTPAuth.URI)
      throw new Error('OTPAuth library is required')

    const otp = OTPAuth.URI.parse(key_uri)
    return otp
  }

  const get_OTP_token = (otp) => {
    return otp.generate()
  }

  const is_TOTP = (otp) => {
    return (otp instanceof OTPAuth.TOTP)
  }

  window.get_OTP = get_OTP
  window.get_OTP_token = get_OTP_token
  window.is_TOTP = is_TOTP

})()
