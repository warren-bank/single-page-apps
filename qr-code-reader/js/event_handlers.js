document.addEventListener('DOMContentLoaded', () => {
  const input_file_element = document.getElementById('qr_code_image_file')
  const submit_button      = document.querySelector('#buttons > button[type="submit"]')
  const results_template   = document.getElementById('tpl-results-container')
  const output_container   = document.querySelector('div.results-container')

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

  const on_submit = async () => {
    empty_container(output_container)

    output_container.appendChild(
      results_template.content.cloneNode(true)
    )

    const output_img_element = output_container.querySelector(':scope img')
    const output_pre_element = output_container.querySelector(':scope pre')
    let txt

    try {
      txt = await window.read_qr_code(input_file_element, output_img_element)
    }
    catch(e) {
      txt = e.message
    }

    output_pre_element.textContent = txt
  }

  submit_button.addEventListener('click', on_submit)
})
