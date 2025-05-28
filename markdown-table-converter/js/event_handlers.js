document.addEventListener('DOMContentLoaded', () => {
  const token_regex         = document.getElementById('token_regex')
  const has_column_headings = document.getElementById('has_column_headings')
  const add_whitespace      = document.getElementById('add_whitespace')
  const input_data          = document.getElementById('input_data')
  const token_container     = document.querySelector('div.token-container')
  const submit_button       = document.querySelector('#buttons > button[type="submit"]')
  const output_container    = document.querySelector('pre.results-container')

  const cancel_event = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  const on_change_format = (event) => {
    cancel_event(event)

    if (event.target.checked) {
      const value = event.target.value
      const hide  = (value !== 'token')

      if (hide)
        token_container.classList.add('hide')
      else
        token_container.classList.remove('hide')
    }
  }

  const on_submit = (event) => {
    cancel_event(event)

    const format = document.querySelector('input[name="format"]:checked')
    if (!format) return

    let markdown

    try {
      switch(format.value) {
        case 'html':
          markdown = window.convert_html_table_to_markdown_table(input_data.value, has_column_headings.checked, add_whitespace.checked)
          break
        case 'token':
          markdown = window.convert_token_separated_list_to_markdown_table(input_data.value, token_regex.value, has_column_headings.checked, add_whitespace.checked)
          break
      }
    }
    catch(e) {
      markdown = null
    }

    output_container.textContent = (markdown || '')
  }

  document.querySelectorAll('input[name="format"]').forEach(el => {
    el.addEventListener('change', on_change_format)
  })

  submit_button.addEventListener('click', on_submit)
})
