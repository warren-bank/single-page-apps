/*
 * -----------------------------------------------------------------------------
 * Goal: prevent yt-dlp HTTP requests from triggering CORS preflight
 * -----------------------------------------------------------------------------
    at the time of commit: 17a7f347bc75ac230b4f58cad5c25caff7af5b46
    ===============================================================
    Python code in:        index.pyodide-0.27.0-fork-2.0.0.html
    ===============================================================
    import pyodide_http
    import base64

    original_urlopen = pyodide_http._urllib.urlopen

    def prevent_mixed_content(req_url):
        window_url_scheme = '${window.location.protocol.toLowerCase()}'
        if window_url_scheme == 'https:':
            req_url_scheme = req_url[:5].lower()
            if req_url_scheme == 'http:':
                req_url = window_url_scheme + req_url[5:]
        return req_url

    enum_forbidden_header_names = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "access-control-request-private-network", "connection", "content-length", "cookie", "date", "dnt", "expect", "host", "keep-alive", "origin", "referer", "set-cookie", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via", "x-http-method", "x-http-method-override", "x-method-override"]

    def encode_forbidden_header_name(name):
        try:
            return enum_forbidden_header_names.index(name.lower())
        except ValueError:
            return -1

    def encode_base64_value(val):
        encoded = base64.b64encode(val.encode()).decode()
        encoded = encoded.rstrip('=').replace('+', '-').replace('/', '*')
        return encoded

    def embed_encoded_headers_into_cors_safelisted_headers(url, encoded_headers):
        cors_safelisted_header_names = ["accept", "accept-language", "content-language", "content-type"]
        encoded_header = None
        cors_safelisted_header_name = None
        cors_safelisted_header_value = None
        encoded_headers.sort(key=len)
        while (len(encoded_headers) > 0) and (len(cors_safelisted_header_names) > 0):
            if encoded_header is None:
                encoded_header = encoded_headers.pop(0)
            if cors_safelisted_header_name is None:
                cors_safelisted_header_name = cors_safelisted_header_names.pop(0)
            if cors_safelisted_header_name == "accept" or cors_safelisted_header_name == "accept-language" or cors_safelisted_header_name == "content-language":
                if cors_safelisted_header_value is None:
                    cors_safelisted_header_value = url.get_header(cors_safelisted_header_name, '')
                if len(cors_safelisted_header_value) + len(",SMH;" + encoded_header) > 128:
                    # cannot embed any additional encoded headers.
                    # finalize, and move to the next safelisted header
                    url.add_header(cors_safelisted_header_name, cors_safelisted_header_value)
                    cors_safelisted_header_name = None
                    cors_safelisted_header_value = None
                else:
                    # embed
                    if len(cors_safelisted_header_value) > 0:
                        cors_safelisted_header_value += ','
                    cors_safelisted_header_value += "SMH;" + encoded_header
                    encoded_header = None
            elif cors_safelisted_header_name == "content-type":
                if url.has_header(cors_safelisted_header_name):
                    # abort, and move to the next safelisted header
                    cors_safelisted_header_name = None
                else:
                    if cors_safelisted_header_value is None:
                        # boundary only;
                        # the rest of the header value will be prepended when finalized
                        cors_safelisted_header_value = 'SMH'
                    if len(cors_safelisted_header_value) + len(";" + encoded_header) > 70:
                        # cannot embed any additional encoded headers.
                        # finalize, and move to the next safelisted header
                        if cors_safelisted_header_value != 'SMH':
                            cors_safelisted_header_value = "multipart/form-data; boundary=" + cors_safelisted_header_value
                            url.add_header(cors_safelisted_header_name, cors_safelisted_header_value)
                        cors_safelisted_header_name = None
                        cors_safelisted_header_value = None
                    else:
                        # embed
                        cors_safelisted_header_value += ";" + encoded_header
                        encoded_header = None

    def modified_urlopen(url, *args, **kwargs):
        if isinstance(url, pyodide_http._urllib.urllib.request.Request):
            url.full_url = prevent_mixed_content(url.full_url)

            cors_safelisted_header_names = ["accept", "accept-language", "content-language", "content-type", "range"]
            encoded_headers = []
            for header_name, header_value in url.header_items():
                header_name = header_name.lower()
                if header_name not in cors_safelisted_header_names:
                    encoded_header_name = encode_forbidden_header_name(header_name)
                    if encoded_header_name >= 0:
                        encoded_header_name = str(encoded_header_name)
                    else:
                        encoded_header_name = encode_base64_value(header_name)
                    encoded_header_value = encode_base64_value(header_value)
                    encoded_headers.append(encoded_header_name + "=" + encoded_header_value)
                    url.remove_header(header_name)
            embed_encoded_headers_into_cors_safelisted_headers(url, encoded_headers)

        else:
            url = prevent_mixed_content(url)
        response = original_urlopen(url, *args, **kwargs)
        if isinstance(url, pyodide_http._urllib.urllib.request.Request):
            response.url = url.full_url
        else:
            response.url = url
        return response

    pyodide_http._urllib.urlopen = modified_urlopen
    ===============================================================
    Test executed in yt-dlp web console:
    ===============================================================
    URL = 'https://www.youtube.com/watch?v=qhKci8jY510'

    ydl_opts = {}

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(URL, download=False)
        print(json.dumps(ydl.sanitize_info(info)))
    ===============================================================
    Dev-Tools Network log:
        200       GET     https://www.youtube.com/watch?v=qhKci8jY510&bpctr=9999999999&has_verified=1
        400       OPTIONS https://www.youtube.com/youtubei/v1/player?prettyPrint=false
          Request headers:
            Access-Control-Request-Headers: content-type,x-goog-visitor-id,x-youtube-client-name,x-youtube-client-version
            Access-Control-Request-Method:  POST
        [Blocked] POST    https://www.youtube.com/youtubei/v1/player?prettyPrint=false
          Request headers:
            Content-type: application/json
            X-goog-visitor-id: CgsxeFFZLTJqc1VfRSjb5Z3PBjIKCgJVUxIEGgAgQWLfAgrcAjE3LllUPXJBVE1YUVFKNnE3eW12TnRjdjdfM1I3WVQ3TU9PRGFDOXdyRkk2NUxPU3FaUWpfWkVZRGxtdE9RYnhlVVd4MlE3MzVPNzlveVB2SGJTUWFzd0R0Q3E1SnpyRkszcnNJMnVwQlZRQ3IwNXJLX2dRZ2p4c0xJd3RfMk5ITmZiZDR4MzU1Zks5SWstRFU3UDhSMEdQd2dYeHJ6Vkh0UVE3OTdoSEx5UzFXNklrSkh2YVF1UE14ZGpONmdfRlVKNnUwVm4zM3B3OGhkS2kwejJoSVphclJRd3lMZXR2b3RhUElfMHdJOXhLRXhObWRaX2RTMng0YTNZR1lIbXRTdEpxRU9BQjZTNmlCLXB2LXhydTdwNnU4Zzd0bW1PZkhlcTdrMUVyYmQ1YXVkTXdvbnl3bFY2S0RMRzlCSzZ6WWF4SVRmOEs3c25yV2JONkZzM3NfMDJBV1YzZw%3D%3D
            X-youtube-client-name: 28
            X-youtube-client-version: 1.65.10
    ===============================================================
    XHR monkeypatch executed in Dev-Tools JS Console:
    ===============================================================
    const originalFetch = window.fetch
    window.fetch = function(resource, config) {
      console.log('fetch() headers:', JSON.stringify(config.headers, null, 2))
      return originalFetch(resource, config)
    }

    const originalXhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader
    XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
      console.log('XMLHttpRequest.setRequestHeader():', name, '=', value)
      return originalXhrSetRequestHeader.apply(this, [name, value])
    }
    ===============================================================
    JS Console log:
        yt_dlp imported: 2026.03.17
        XMLHttpRequest.setRequestHeader(): Accept = SMH;1=Z3ppcCwgZGVmbGF0ZQ,SMH;c2VjLWZldGNoLW1vZGU=bmF2aWdhdGU
        XMLHttpRequest.setRequestHeader(): Accept-language = en-us,en;q=0.5
        XMLHttpRequest.setRequestHeader(): Sec-fetch-mode = navigate
        Attempt to set a forbidden header was denied: Sec-fetch-mode
        XMLHttpRequest.setRequestHeader(): Accept-encoding = gzip, deflate
        Attempt to set a forbidden header was denied: Accept-encoding
        Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://www.youtube.com/watch?v=qhKci8jY510&bpctr=9999999999&has_verified=1. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 200.
        XMLHttpRequest.setRequestHeader(): Accept = SMH;1=Z3ppcCwgZGVmbGF0ZQ,SMH;c2VjLWZldGNoLW1vZGU=bmF2aWdhdGU
        XMLHttpRequest.setRequestHeader(): Accept-language = en-us,en;q=0.5
        XMLHttpRequest.setRequestHeader(): Sec-fetch-mode = navigate
        Attempt to set a forbidden header was denied: Sec-fetch-mode
        XMLHttpRequest.setRequestHeader(): Accept-encoding = gzip, deflate
        Attempt to set a forbidden header was denied: Accept-encoding
        XMLHttpRequest.setRequestHeader(): Accept = SMH;1=Z3ppcCwgZGVmbGF0ZQ,SMH;c2VjLWZldGNoLW1vZGU=bmF2aWdhdGU,SMH;eC15b3V0dWJlLWNsaWVudC1uYW1l=Mjg
        XMLHttpRequest.setRequestHeader(): Accept-language = SMH;13=aHR0cHM6Ly93d3cueW91dHViZS5jb20,SMH;eC15b3V0dWJlLWNsaWVudC12ZXJzaW9u=MS42NS4xMA
        XMLHttpRequest.setRequestHeader(): Sec-fetch-mode = navigate
        Attempt to set a forbidden header was denied: Sec-fetch-mode
        XMLHttpRequest.setRequestHeader(): Content-type = application/json
        XMLHttpRequest.setRequestHeader(): X-youtube-client-name = 28
        XMLHttpRequest.setRequestHeader(): X-youtube-client-version = 1.65.10
        XMLHttpRequest.setRequestHeader(): Origin = https://www.youtube.com
        Attempt to set a forbidden header was denied: Origin
        XMLHttpRequest.setRequestHeader(): X-goog-visitor-id = CgsxeFFZLTJqc1VfRSjb5Z3PBjIKCgJVUxIEGgAgQWLfAgrcAjE3LllUPXJBVE1YUVFKNnE3eW12TnRjdjdfM1I3WVQ3TU9PRGFDOXdyRkk2NUxPU3FaUWpfWkVZRGxtdE9RYnhlVVd4MlE3MzVPNzlveVB2SGJTUWFzd0R0Q3E1SnpyRkszcnNJMnVwQlZRQ3IwNXJLX2dRZ2p4c0xJd3RfMk5ITmZiZDR4MzU1Zks5SWstRFU3UDhSMEdQd2dYeHJ6Vkh0UVE3OTdoSEx5UzFXNklrSkh2YVF1UE14ZGpONmdfRlVKNnUwVm4zM3B3OGhkS2kwejJoSVphclJRd3lMZXR2b3RhUElfMHdJOXhLRXhObWRaX2RTMng0YTNZR1lIbXRTdEpxRU9BQjZTNmlCLXB2LXhydTdwNnU4Zzd0bW1PZkhlcTdrMUVyYmQ1YXVkTXdvbnl3bFY2S0RMRzlCSzZ6WWF4SVRmOEs3c25yV2JONkZzM3NfMDJBV1YzZw%3D%3D
        XMLHttpRequest.setRequestHeader(): Accept-encoding = gzip, deflate
        Attempt to set a forbidden header was denied: Accept-encoding
        XMLHttpRequest.setRequestHeader(): Content-language = <empty string>
        XHR OPTIONS https://www.youtube.com/youtubei/v1/player?prettyPrint=false CORS Preflight Did Not Succeed
        Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://www.youtube.com/youtubei/v1/player?prettyPrint=false. (Reason: CORS preflight response did not succeed). Status code: 400.
        Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://www.youtube.com/youtubei/v1/player?prettyPrint=false. (Reason: CORS request did not succeed). Status code: (null).
    Script to decode header values:
        https://github.com/warren-bank/crx-simple-modify-headers/raw/7089ea3644fd56b2e8d56a1462eb76170683b8c5/tests/unit/parse-CORS-safelisted-HTTP-request-header.js
        https://github.com/warren-bank/crx-simple-modify-headers/raw/7089ea3644fd56b2e8d56a1462eb76170683b8c5/tests/unit/parse-CORS-safelisted-HTTP-request-header.bat
    Decoded header values:
        SMH;1=Z3ppcCwgZGVmbGF0ZQ,SMH;c2VjLWZldGNoLW1vZGU=bmF2aWdhdGU
            accept-encoding: gzip, deflate
            sec-fetch-mode: navigate
        SMH;1=Z3ppcCwgZGVmbGF0ZQ,SMH;c2VjLWZldGNoLW1vZGU=bmF2aWdhdGU
            accept-encoding: gzip, deflate
            sec-fetch-mode: navigate
        SMH;1=Z3ppcCwgZGVmbGF0ZQ,SMH;c2VjLWZldGNoLW1vZGU=bmF2aWdhdGU,SMH;eC15b3V0dWJlLWNsaWVudC1uYW1l=Mjg
            accept-encoding: gzip, deflate
            sec-fetch-mode: navigate
            x-youtube-client-name: 28
        SMH;13=aHR0cHM6Ly93d3cueW91dHViZS5jb20,SMH;eC15b3V0dWJlLWNsaWVudC12ZXJzaW9u=MS42NS4xMA
            origin: https://www.youtube.com
            x-youtube-client-version: 1.65.10
 * -----------------------------------------------------------------------------
 * New Strategy (v1):
     1. remove Python code from: index.pyodide-0.27.0-fork-2.0.0.html
     2. add JS code to monkeypatch XMLHttpRequest
          setRequestHeader():
            store name:value pair in an Object instance variable
          send():
            encode unsafe headers
            call the original setRequestHeader() to include safe headers
            call the original send()
 * -----------------------------------------------------------------------------
 * New Strategy (v2):
     1. Observations:
          It occurs to me that the Python code is correctly encoding all of the unsafe headers.
          However, the unsafe headers which should then be removed.. were not in fact removed.
     2. Code summary:
            for header_name, header_value in url.header_items():
                header_name = header_name.lower()
                if header_name not in cors_safelisted_header_names:
                    url.remove_header(header_name)
     3. Code analysis:
          It would seem that header names are case-sensitive in the Python class:
            urllib.request.Request
     4. Documentation:
          https://docs.python.org/3/library/urllib.request.html
          https://docs.python.org/3/library/urllib.request.html#urllib.request.Request.remove_header
          https://bugs.python.org/issue2275
          https://github.com/python/cpython/issues/46528
            => confirmed, header names are case-sensitive
 * -----------------------------------------------------------------------------
 */
