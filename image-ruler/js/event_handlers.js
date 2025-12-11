document.addEventListener('DOMContentLoaded', () => {
  const state = {
    img: {
      width: 0,
      height: 0
    },
    axis: 'x',
    calibration: {
      x: {px: 0, units: 0},
      y: {px: 0, units: 0}
    },
    is_selecting_region: false,
    selected_region: {
      top: -1,
      left: -1,
      bottom: -1,
      right: -1
    }
  }

  const update_blob = (blob) => {
    const $img = document.createElement('img')
    $img.addEventListener('load', () => {
      update_image($img)
    })
    $img.src = URL.createObjectURL(blob)
  }

  const update_image = ($img) => {
    state.img.width = $img.width
    state.img.height = $img.height
    state.axis = 'x'
    state.calibration.x = {px: 0, units: 0}
    state.calibration.y = {px: 0, units: 0}
    state.selected_region.top = -1
    state.selected_region.left = -1
    state.selected_region.bottom = -1
    state.selected_region.right = -1

    let el

    el = document.getElementById('calibrate_units')
    el.value = '0'

    el = document.getElementById('input-calibration')
    el.classList.remove('hide')

    el = document.getElementById('output-measurement')
    el.classList.add('hide')

    el = document.getElementById('ruler-container')
    empty_element(el)
    el.appendChild($img)
  }

  const reset_selected_region = () => {
    state.selected_region.top = -1
    state.selected_region.left = -1
    state.selected_region.bottom = -1
    state.selected_region.right = -1

    for (const el of document.querySelectorAll('#ruler-container > div.ruler')) {
      el.remove()
    }
  }

  const update_calibration = () => {
    try {
      const c_units = Number(document.getElementById('calibrate_units').value.trim())
      const c_px = (state.axis === 'x')
        ? Math.abs(state.selected_region.right - state.selected_region.left)
        : Math.abs(state.selected_region.bottom - state.selected_region.top)

      if (!c_units)
        throw new Error('Please specify the number of custom units')

      if (c_px <= 0)
        throw new Error('Please highlight a distance on the image that corresponds to the specified number of custom units')

      state.calibration[state.axis] = {px: c_px, units: c_units}
      return true
    }
    catch(e) {
      window.alert(e.message)
      return false
    }
  }

  const update_result = () => {
    const {px: c_px, units: c_units} = state.calibration[state.axis]
    if (!c_px || !c_units) return

    const s_px = (state.axis === 'x')
      ? (
          ((state.selected_region.right === -1) || (state.selected_region.left === -1))
            ? 0
            : Math.abs(state.selected_region.right - state.selected_region.left)
        )
      : (
          ((state.selected_region.bottom === -1) || (state.selected_region.top === -1))
            ? 0
            : Math.abs(state.selected_region.bottom - state.selected_region.top)
        )

    // (s_units/s_px) = (c_units/c_px)
    const s_units = (c_units/c_px)*(s_px)

    let el

    el = document.getElementById('result')
    el.textContent = s_units.toFixed(4)

    el = document.getElementById('output-measurement')
    el.classList.remove('hide')
  }

  const empty_element = (el) => {
    while (el.childNodes.length)
      el.removeChild(el.childNodes[0])
  }

  document.getElementById('import_image_clipboard').addEventListener('click', async () => {
    let permission
    try {
      permission = await navigator.permissions.query({
        name: 'clipboard-read'
      })
    }
    catch (e) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#security_considerations
      console.log('Browser does not support "clipboard-read" permission.')
    }
    try {
      if (permission && (permission.state === 'denied')) {
        throw new Error('Not allowed to read clipboard.')
      }
      const clipboardContents = await navigator.clipboard.read()
      for (const item of clipboardContents) {
        if (item.types.includes('image/png')) {
          const blob = await item.getType('image/png')
          update_blob(blob)
          break
        }
      }
      throw new Error('Clipboard contains no image data.')
    }
    catch (e) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read#browser_compatibility
      console.error(e.message)
    }
  })

  document.getElementById('import_image_file').addEventListener('click', () => {
    const $input = document.createElement('input')
    $input.type = 'file'
    $input.accept = 'image/png, image/jpeg'
    $input.addEventListener('change', () => {
      try {
        if (!$input.files.length) {
          throw new Error('No image file selected.')
        }
        const file = $input.files[0]
        const reader = new FileReader()
        reader.onload = function(event) {
          const blob = new Blob([event.target.result])
          update_blob(blob)
        }
        reader.readAsArrayBuffer(file)
      }
      catch (e) {
        console.error(e.message)
      }
    })
    $input.click()
  })

  document.getElementById('axis').addEventListener('change', (event) => {
    event.preventDefault()
    reset_selected_region()
    state.axis = event.target.value
    const calibration = state.calibration[state.axis]
    let el

    el = document.getElementById('calibrate_units')
    el.value = String(calibration.units)

    if (!calibration.units) {
      el = document.getElementById('output-measurement')
      el.classList.add('hide')
    }
  })

  document.getElementById('calibrate_button').addEventListener('click', () => {
    update_calibration() && update_result()
  })

  document.getElementById('ruler-container').addEventListener('mousedown', (event) => {
    event.preventDefault()
    if (event.target.tagName.toLowerCase() !== 'img') return
    reset_selected_region()

    state.is_selecting_region = true
    state.selected_region.top = event.offsetY
    state.selected_region.left = event.offsetX

    let el

    el = document.createElement('div')
    el.classList.add('ruler')
    el.classList.add(state.axis + '-axis')
    el.style.top = state.selected_region.top + 'px'
    el.style.left = state.selected_region.left + 'px'

    event.currentTarget.appendChild(el)
  })

  document.getElementById('ruler-container').addEventListener('mousemove', (event) => {
    event.preventDefault()
    if (event.target.tagName.toLowerCase() !== 'img') return
    if (!state.is_selecting_region) return

    let el

    el = event.currentTarget.querySelector('.ruler')
    if (!el) return

    if (state.axis === 'x') {
      state.selected_region.right = event.offsetX
      el.style.left = Math.min(state.selected_region.left, state.selected_region.right) + 'px'
      el.style.width = Math.abs(state.selected_region.right - state.selected_region.left) + 'px'
    }
    else {
      state.selected_region.bottom = event.offsetY
      el.style.top = Math.min(state.selected_region.top, state.selected_region.bottom) + 'px'
      el.style.height = Math.abs(state.selected_region.bottom - state.selected_region.top) + 'px'
    }

    update_result()
  })

  document.getElementById('ruler-container').addEventListener('mouseup', (event) => {
    event.preventDefault()
    if (event.target.tagName.toLowerCase() !== 'img') return
    state.is_selecting_region = false
    update_result()
  })

})
