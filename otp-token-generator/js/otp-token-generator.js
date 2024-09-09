(function(){

  const otp_token_generator = (key_uri) => {
    if (!OTPAuth || !OTPAuth.URI)
      throw new Error('OTPAuth library is required')

    const totp = OTPAuth.URI.parse(key_uri)
    const token = totp.generate()

    return token
  }

  window.otp_token_generator = otp_token_generator

})()
