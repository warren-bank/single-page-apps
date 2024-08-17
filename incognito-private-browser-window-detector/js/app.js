/* -----------------------------------------------------------------------------
 * powered by:
 * -----------------------------------------------------------------------------
 * https://github.com/Joe12387/detectIncognito
 * -----------------------------------------------------------------------------
 */

const getModeName = (browserName) => {
  switch (browserName) {
    case "Safari":
    case "Firefox":
    case "Brave":
    case "Opera":
      return "a Private Window";
      break;
    case "Chrome":
    case "Chromium":
      return "an Incognito Window";
      break;
    case "Internet Explorer":
    case "Edge":
      return "an InPrivate Window";
      break;
  }
  throw new Error("Could not get mode name");
}

const getDetectionMessage = async () => {
  try {
    if (typeof detectIncognito !== 'function')
      throw 'detectIncognito script failed to load from CDN'

    const result = await detectIncognito()

    return result.isPrivate
      ? "<b>Yes</b>. You are using " + result.browserName + " in " + getModeName(result.browserName) + "."
      : "<b>No</b>. You are using " + result.browserName + " in a regular browser window."
  }
  catch(e) {
    console.log('error:', e)
    return "<b>There was an error.</b> Check console for further information. If the problem persists, please <a href='https://github.com/Joe12387/detectIncognito/issues'>report the issue</a> on GitHub."
  }
}

const detect = async () => {
  const container = document.querySelector('section.tester-container')
  const message   = await getDetectionMessage()

  container.innerHTML = message
}

document.addEventListener('DOMContentLoaded', detect)
