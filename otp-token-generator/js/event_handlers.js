document.addEventListener('DOMContentLoaded', () => {
  const input_key_uri    = document.getElementById('key_uri')
  const submit_button    = document.querySelector('#buttons > button[type="submit"]')
  const output_container = document.querySelector('div.results-container')
  const templates = {
    "error": document.getElementById('tpl-error'),
    "token": document.getElementById('tpl-token'),
    "totp":  document.getElementById('tpl-totp')
  }
  let otp, totp_timer
  let token_pre, totp_secs, totp_progress

  const cancel_event = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  const empty_container = (container) => {
    if (!container || !(container instanceof HTMLElement))
      return

    while (container.childNodes.length)
      container.removeChild(container.childNodes[0])
  }

  const reset_state = () => {
    if (totp_timer) clearInterval(totp_timer)

    otp = null
    totp_timer = 0
    token_pre = null
    totp_secs = null
    totp_progress = null
  }

  const on_click_token = (event) => {
    cancel_event(event)

    if (token_pre.textContent)
      navigator.clipboard.writeText(token_pre.textContent)
  }

  const update_token = () => {
    const otp_token = window.get_OTP_token(otp)

    token_pre.textContent = otp_token
  }

  const update_totp = () => {
    const current_seconds = Math.round(new Date().getTime() / 1000.0)
    const seconds_until_update = otp.period - (current_seconds % otp.period)

    totp_secs.textContent = seconds_until_update
    totp_progress.value   = seconds_until_update

    if (seconds_until_update === (otp.period - 1))
      update_token()
  }

  const on_submit = (event) => {
    cancel_event(event)
    empty_container(output_container)
    reset_state()

    try {
      const key_uri = input_key_uri.value
      otp = window.get_OTP(key_uri)

      output_container.appendChild(
        templates.token.content.cloneNode(true)
      )

      token_pre = output_container.querySelector(':scope pre')
      token_pre.addEventListener('click', on_click_token)
      update_token()

      if (window.is_TOTP(otp) && otp.period) {
        output_container.appendChild(
          templates.totp.content.cloneNode(true)
        )

        totp_secs     = output_container.querySelector(':scope span.totp-secs')
        totp_progress = output_container.querySelector(':scope progress')

        totp_progress.max = otp.period

        update_totp()
        totp_timer = setInterval(update_totp, 1000)
      }
    }
    catch(e) {
      output_container.appendChild(
        templates.error.content.cloneNode(true)
      )

      const error_pre = output_container.querySelector(':scope pre')
      error_pre.textContent = e.message
    }
  }

  submit_button.addEventListener('click', on_submit)
})
