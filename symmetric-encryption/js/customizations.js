// =============================================================================

window.addEventListener('load', function() {

  const $ciphertext = document.getElementById('ciphertext')
  const $encrypt    = document.getElementById('encrypt')

  // optionally hard-code a non-zero-length ciphertext value that the user cannot change
  $ciphertext.value = ''

  if ($ciphertext.value) {
    $ciphertext.disabled = true
    $encrypt.disabled    = true
  }

})

// =============================================================================

window.addEventListener('load', function() {

  const $cleartext  = document.getElementById('cleartext')
  const $decrypt    = document.getElementById('decrypt')

  // optionally hard-code a non-zero-length cleartext value that the user cannot change
  $cleartext.value = ''

  if ($cleartext.value) {
    $cleartext.disabled = true
    $decrypt.disabled   = true
  }

})

// =============================================================================
