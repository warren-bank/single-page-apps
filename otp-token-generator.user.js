// ==UserScript==
// @name         One Time Password (OTP) token generator
// @description  Add a dropdown field with a list of private keys.
// @version      1.0.0
// @match        *://warren-bank.github.io/single-page-apps/otp-token-generator/
// @match        *://warren-bank.github.io/single-page-apps/otp-token-generator/index.html
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/single-page-apps/tree/userscripts
// @supportURL   https://github.com/warren-bank/single-page-apps/issues
// @downloadURL  https://github.com/warren-bank/single-page-apps/raw/userscripts/otp-token-generator.user.js
// @updateURL    https://github.com/warren-bank/single-page-apps/raw/userscripts/otp-token-generator.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

var user_options = {
  "script_enabled":  true,
  "script_delay_ms": 500,
  "private_keys": [
    {
      "name":  "Acme Corporation",
      "value": "otpauth://totp/ACME:RoadRunner?issuer=ACME&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30"
    },
    {
      "name":  "Spacely Sprockets",
      "value": "otpauth://totp/SPACELY:Sprockets?issuer=SPACELY&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30"
    },
    {
      "name":  "Cogswell Cogs",
      "value": "otpauth://totp/COGSWELL:Cogs?issuer=COGSWELL&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30"
    },
    {
      "name":  "Hash-based One Time Password (HOTP) example",
      "value": "otpauth://hotp/alice@google.com?secret=base32secret&counter=0"
    }
  ]
}

// -----------------------------------------------------------------------------

var add_private_keys_dropdown = function(){
  var $key_uri = document.getElementById('key_uri')
  var $select  = document.createElement('select')
  var label_id = '-1'
  var $option

  {
    $option = document.createElement('option')
    $option.value = label_id
    $option.textContent = '-- Bookmarks --'

    $select.appendChild($option)
  }

  for (var i=0; i < user_options.private_keys.length; i++) {
    $option = document.createElement('option')
    $option.value = '' + i
    $option.textContent = user_options.private_keys[i].name

    $select.appendChild($option)
  }

  $select.addEventListener('change', function(event) {
    event.preventDefault()
    event.stopPropagation()

    if ($select.value === label_id) return

    var index = parseInt($select.value, 10)
    $select.value = label_id

    var private_key = user_options.private_keys[index].value
    $key_uri.value = private_key
  })

  $select.style.display = 'block'
  $select.style.marginBottom = '1.6rem'

  $key_uri.parentNode.insertBefore($select, $key_uri)
}

// -----------------------------------------------------------------------------
// bootstrap

if (user_options['script_enabled']) {
  setTimeout(
    add_private_keys_dropdown,
    user_options['script_delay_ms']
  )
}
