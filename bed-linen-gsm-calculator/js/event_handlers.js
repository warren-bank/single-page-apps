document.addEventListener('DOMContentLoaded', () => {
  const select_common_dimensions = document.getElementById('select_common_dimensions')
  const input_width              = document.getElementById('input_width')
  const input_length             = document.getElementById('input_length')
  const input_weight             = document.getElementById('input_weight')
  const output_container         = document.querySelector('pre.results-container')

  const cancel_event = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  const on_select_common_dimensions = (event) => {
    cancel_event(event)

    const units = document.querySelector('input[name="units"]:checked')
    if (!units) return

    const imperial_units    = (units.value === 'imperial')
    const common_dimensions = select_common_dimensions.value

    // https://www.bedbathandbeyond.com/guides/bedroom/bed-sheet-sizes-chart
    switch(common_dimensions) {
      case "flat_twin":
        input_width.value  = (imperial_units ? "72"  : "180")
        input_length.value = (imperial_units ? "102" : "260")
        break
      case "flat_twin_xl":
        input_width.value  = (imperial_units ? "72"  : "180")
        input_length.value = (imperial_units ? "114" : "290")
        break
      case "flat_full":
        input_width.value  = (imperial_units ? "87"  : "220")
        input_length.value = (imperial_units ? "102" : "260")
        break
      case "flat_queen":
        input_width.value  = (imperial_units ? "92"  : "230")
        input_length.value = (imperial_units ? "108" : "260")
        break
      case "flat_king":
        input_width.value  = (imperial_units ? "110" : "280")
        input_length.value = (imperial_units ? "114" : "290")
        break
      case "flat_king_ca":
        input_width.value  = (imperial_units ? "111" : "280")
        input_length.value = (imperial_units ? "114" : "290")
        break
      case "fitted_twin":
        input_width.value  = (imperial_units ? String(39 + (14*2)) : String(99  + (36*2)))
        input_length.value = (imperial_units ? String(76 + (14*2)) : String(193 + (36*2)))
        break
      case "fitted_twin_xl":
        input_width.value  = (imperial_units ? String(39 + (14*2)) : String(99  + (36*2)))
        input_length.value = (imperial_units ? String(80 + (14*2)) : String(203 + (36*2)))
        break
      case "fitted_full":
        input_width.value  = (imperial_units ? String(54 + (15*2)) : String(137 + (38*2)))
        input_length.value = (imperial_units ? String(76 + (15*2)) : String(193 + (38*2)))
        break
      case "fitted_queen":
        input_width.value  = (imperial_units ? String(60 + (15*2)) : String(152 + (38*2)))
        input_length.value = (imperial_units ? String(80 + (15*2)) : String(203 + (38*2)))
        break
      case "fitted_king":
        input_width.value  = (imperial_units ? String(73 + (15*2)) : String(185 + (38*2)))
        input_length.value = (imperial_units ? String(80 + (15*2)) : String(203 + (38*2)))
        break
      case "fitted_king_ca":
        input_width.value  = (imperial_units ? String(73 + (15*2)) : String(185 + (38*2)))
        input_length.value = (imperial_units ? String(85 + (15*2)) : String(216 + (38*2)))
        break
    }

    select_common_dimensions.value = "0"
  }

  const on_submit = (event) => {
    cancel_event(event)

    const units = document.querySelector('input[name="units"]:checked')
    if (!units) return

    const imperial_units = (units.value === 'imperial')
    const gsm            = window.calculate_gsm(input_width.value, input_length.value, input_weight.value, imperial_units)

    output_container.innerHTML = gsm ? `GSM = ${gsm.toFixed(2)} grams/m<sup>2</sup>` : ''
  }

  select_common_dimensions.addEventListener('change', on_select_common_dimensions)

  document.querySelector('#buttons > button[type="submit"]').addEventListener('click', on_submit)
})
