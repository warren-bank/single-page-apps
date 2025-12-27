var get_anchor_url = function(user_options, url) {
  if (!url)
    url = unsafeWindow.location.href

  if (user_options.cors_proxy_url_prefix)
    url = user_options.cors_proxy_url_prefix + url

  url = user_options.crosswords_url + '?puzzle=' + btoa(url)
  return url
}

var append_anchor_image = function(user_options, url, $container) {
  var $a, $img

  if (!$container)
    $container = unsafeWindow.document.body

  $a = unsafeWindow.document.createElement('a')
  $a.setAttribute('target', '_blank')
  $a.setAttribute('href', get_anchor_url(user_options, url))
  $a.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; z-index: 9999; width: ' + user_options.anchor_image.width + '; height: ' + user_options.anchor_image.height)

  $img = unsafeWindow.document.createElement('img')
  $img.setAttribute('src', user_options.anchor_image.url)
  $img.setAttribute('style', 'width: ' + user_options.anchor_image.width + '; height: ' + user_options.anchor_image.height)

  $a.appendChild($img)
  $container.appendChild($a)
}
