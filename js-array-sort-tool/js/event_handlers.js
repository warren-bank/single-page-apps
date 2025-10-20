document.addEventListener('DOMContentLoaded', () => {
  const json_array                  = document.getElementById('json_array')
  const js_sort_comparator_function = document.getElementById('js_sort_comparator_function')
  const common_comparators          = document.getElementById('common_comparators')
  const validate_button             = document.getElementById('validate_button')
  const sort_button                 = document.getElementById('sort_button')
  const copy_result_button          = document.getElementById('copy_result_button')
  const output_container            = document.querySelector('pre.results-container')

  const cancel_event = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  const get_json_array = () => {
    try {
      return JSON.parse(json_array.value)
    }
    catch(e) {
      window.alert('JSON Array is not valid')
      return null
    }
  }

  const get_js_sort_comparator_function = () => {
    try {
      return new Function('a', 'b', js_sort_comparator_function.value)
    }
    catch(e) {
      window.alert('JavaScript Sort Comparator Function is not valid')
      return null
    }
  }

  const on_common_comparator = (event) => {
    cancel_event(event)

    switch(common_comparators.value) {
      case 'lexicographical':
        js_sort_comparator_function.value = (`
a = String(a)
b = String(b)

return (a < b) ? -1 : ((a > b) ? 1 : 0)
        `).trim()
        break

      case 'localecompare':
        js_sort_comparator_function.value = 'return a.localeCompare(b)'
        break

      case 'numerical':
        js_sort_comparator_function.value = 'return a - b'
        break

      case 'bigint':
        js_sort_comparator_function.value = (`
a = BigInt(a)
b = BigInt(b)

return (a < b) ? -1 : ((a > b) ? 1 : 0)
        `).trim()
        break
    }
  }

  const on_validate = (event) => {
    cancel_event(event)

    const $json_array = get_json_array()
    if (!$json_array) return

    const $js_sort_comparator_function = get_js_sort_comparator_function()
    if (!$js_sort_comparator_function) return

    const is_sorted = is_array_sorted($json_array, $js_sort_comparator_function)
    const result = is_sorted ? 'Array is sorted' : 'Array is not sorted'

    output_container.textContent = result
  }

  const on_sort = (event) => {
    cancel_event(event)

    const $json_array = get_json_array()
    if (!$json_array) return

    const $js_sort_comparator_function = get_js_sort_comparator_function()
    if (!$js_sort_comparator_function) return

    $json_array.sort($js_sort_comparator_function)
    const result = JSON.stringify($json_array, null, 2)

    output_container.textContent = result
  }

  const on_copy_result = (event) => {
    cancel_event(event)

    const result = output_container.textContent
    if (!result) return

    try {
      navigator.clipboard.writeText(result)
    }
    catch(e) {
      window.alert('Failed to copy result to clipboard. Sorry!')
    }
  }

  common_comparators.addEventListener('change', on_common_comparator)
  validate_button.addEventListener('click', on_validate)
  sort_button.addEventListener('click', on_sort)
  copy_result_button.addEventListener('click', on_copy_result)
})
