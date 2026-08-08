window.addEventListener('load', function() {

  var $decoded_ascii = document.getElementById('decoded_ascii')
  var $encoded_ascii = document.getElementById('encoded_ascii')
  var $encode        = document.getElementById('encode')
  var $decode        = document.getElementById('decode')

  var do_encode = function() {
    var decoded_ascii    = $decoded_ascii.value
    var encoded_ascii    = window.encode_ascii(decoded_ascii)
    $encoded_ascii.value = encoded_ascii
  }

  var do_decode = function() {
    var encoded_ascii    = $encoded_ascii.value
    var decoded_ascii    = window.decode_ascii(encoded_ascii)
    $decoded_ascii.value = decoded_ascii
  }

  $encode.onclick = do_encode
  $decode.onclick = do_decode

})
