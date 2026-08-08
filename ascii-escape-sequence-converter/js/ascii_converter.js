(function(){

  var encode_ascii = function(decoded_ascii) {
    if (!decoded_ascii) return ''

    var encoded_ascii = ''
    var i, hex

    for (i=0; i<decoded_ascii.length; i++) {
      hex = decoded_ascii.charCodeAt(i).toString(16)

      if (hex.length < 2)
        hex = "0" + hex

      encoded_ascii += "\\x" + hex
    }

    return encoded_ascii
  }

  var decode_ascii = function(encoded_ascii) {
    return (!encoded_ascii)
      ? ''
      : encoded_ascii.replace(/\\x([0-9A-Fa-f]{2})/g, function(match, hex) {
          return String.fromCharCode(parseInt(hex, 16))
        })
  }

  window.encode_ascii = encode_ascii
  window.decode_ascii = decode_ascii

})()
