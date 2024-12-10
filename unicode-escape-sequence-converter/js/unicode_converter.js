(function(){

  var encode_unicode = function(decoded_unicode) {
    if (!decoded_unicode) return ''

    var encoded_unicode = ''
    var decimal_value = 0

    for (i=0; i<decoded_unicode.length; i++) {
      decimal_value = decoded_unicode.charCodeAt(i)

      if (decimal_value > 127) {
        encoded_unicode += '\\u' + decimal_to_hex(decimal_value, 4)
      }
      else {
        encoded_unicode += decoded_unicode.charAt(i)
      }
    }

    return encoded_unicode
  }

  var decode_unicode = function(encoded_unicode) {
    if (!encoded_unicode) return ''

    var regex = /\\u([\d\w]{4})/gi
    var escaped_decoded_unicode = encoded_unicode.replace(regex, function (match, group) {
      return String.fromCharCode(parseInt(group, 16))
    })
    var decoded_unicode = unescape(escaped_decoded_unicode)

    return decoded_unicode
  }

  var decimal_to_hex = function(decimal_value, padding) {
    var hex = Number(decimal_value).toString(16)
    padding = ((typeof padding === "undefined") || (padding === null))
      ? 2
      : padding

    while (hex.length < padding) {
      hex = "0" + hex
    }

    return hex
  }

  window.encode_unicode = encode_unicode
  window.decode_unicode = decode_unicode

})()
