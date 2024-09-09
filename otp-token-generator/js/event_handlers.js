document.addEventListener('DOMContentLoaded', () => {
  const input_key_uri    = document.getElementById('key_uri')
  const submit_button    = document.querySelector('#buttons > button[type="submit"]')
  const results_template = document.getElementById('tpl-results-container')
  const output_container = document.querySelector('div.results-container')

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

  const on_submit = (event) => {
    cancel_event(event)
    empty_container(output_container)

    output_container.appendChild(
      results_template.content.cloneNode(true)
    )

    const output_pre_element = output_container.querySelector(':scope pre')
    let txt

    try {
      txt = window.otp_token_generator(input_key_uri.value)
    }
    catch(e) {
      txt = e.message
    }

    output_pre_element.textContent = txt
  }

  submit_button.addEventListener('click', on_submit)
})
