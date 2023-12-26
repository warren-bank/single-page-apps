window.addEventListener('load', function() {

  const $cleartext  = document.getElementById('cleartext')
  const $passphrase = document.getElementById('passphrase')
  const $ciphertext = document.getElementById('ciphertext')
  const $encrypt    = document.getElementById('encrypt')
  const $decrypt    = document.getElementById('decrypt')

  const do_encrypt = function() {
    const cleartext  = $cleartext.value
    const passphrase = $passphrase.value

    if (!cleartext || !passphrase) {
      alert('missing required value(s)')
      return
    }

    const ciphertext  = CryptoJS.AES.encrypt(cleartext, passphrase).toString()
    $ciphertext.value = ciphertext
  }

  const do_decrypt = function() {
    const ciphertext = $ciphertext.value
    const passphrase = $passphrase.value

    if (!ciphertext || !passphrase) {
      alert('missing required value(s)')
      return
    }

    const cleartext  = CryptoJS.AES.decrypt(ciphertext, passphrase).toString(CryptoJS.enc.Utf8)
    $cleartext.value = cleartext
  }

  $encrypt.onclick = do_encrypt
  $decrypt.onclick = do_decrypt

})
