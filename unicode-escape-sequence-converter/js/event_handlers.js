window.addEventListener('load', function() {

  var $decoded_unicode = document.getElementById('decoded_unicode')
  var $encoded_unicode = document.getElementById('encoded_unicode')
  var $encode          = document.getElementById('encode')
  var $decode          = document.getElementById('decode')

  var do_encode = function() {
    var decoded_unicode  = $decoded_unicode.value
    var encoded_unicode  = window.encode_unicode(decoded_unicode)
    $encoded_unicode.value = encoded_unicode
  }

  var do_decode = function() {
    var encoded_unicode  = $encoded_unicode.value
    var decoded_unicode  = window.decode_unicode(encoded_unicode)
    $decoded_unicode.value = decoded_unicode
  }

  $encode.onclick = do_encode
  $decode.onclick = do_decode

})
