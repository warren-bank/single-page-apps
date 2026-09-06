document.addEventListener("DOMContentLoaded", async (event) => {

  // ---------------------------------------------------------------------------

  const $element = {
    search_brands: {
      container: document.getElementById('search_brands'),
      select: {
        brands: document.getElementById('brands'),
        products: document.getElementById('products'),
        shades: document.getElementById('shades'),
      }
    },
    search_lancome: {
      container: document.getElementById('search_lancome'),
      select: {
        lancome_shades: document.getElementById('lancome_shades'),
      }
    },
    brands_matching_selected_lancome_shade: {
      container: document.getElementById('brands_matching_selected_lancome_shade'),
      table: document.querySelector('#brands_matching_selected_lancome_shade > table')
    }
  }

  // ---------------------------------------------------------------------------

  const static_data = await fetch('./etc/3_filter_static_data/output/static_data.json').then(res => res.json())
  const reversed_static_data = await fetch('./etc/4_reverse_static_data/output/reversed_static_data.json').then(res => res.json())

  const get_lancome_shade_id = (brand_id, product_id, shade_id) => {
    try {
      return static_data.brands[brand_id].products[product_id].shades[shade_id].lancome_match
    }
    catch(e) {}
    return null
  }

  // ---------------------------------------------------------------------------

  const remove_all_children = (el) => {
    while (el.childNodes.length)
      el.removeChild(el.childNodes[0])
  }

  const cancel_event = (event) => {
    event.preventDefault()
    event.stopImmediatePropagation()
    event.stopPropagation()
  }

  // ---------------------------------------------------------------------------

  const populate_brands = () => {
    const $select   = $element.search_brands.select.brands
    const brands    = static_data.brands
    const brand_ids = Object.keys(brands).sort((a_id, b_id) => {
      const a_name = brands[a_id].name
      const b_name = brands[b_id].name
      return a_name.localeCompare(b_name)
    })

    // heading
    {
      const $option = document.createElement('option')
      $option.setAttribute('value', '')
      $option.textContent = '-- Brand --'

      $select.appendChild($option)
    }

    for (const brand_id of brand_ids) {
      const brand = brands[brand_id]

      const $option = document.createElement('option')
      $option.setAttribute('value', brand_id)
      $option.textContent = brand.name

      $select.appendChild($option)
    }

    reset_brands()
  }

  const reset_brands = () => {
    set_brand('')
  }

  const set_brand = (brand_id) => {
    const $select = $element.search_brands.select.brands
    $select.value = brand_id
  }

  // ---------------------------------------------------------------------------

  const populate_products = (brand_id) => {
    reset_products()

    const $select     = $element.search_brands.select.products
    const products    = static_data.brands[brand_id].products
    const product_ids = Object.keys(products).sort((a_id, b_id) => {
      const a_name = products[a_id].name
      const b_name = products[b_id].name
      return a_name.localeCompare(b_name)
    })

    // heading
    {
      const $option = document.createElement('option')
      $option.setAttribute('value', '')
      $option.textContent = '-- Product --'

      $select.appendChild($option)
    }

    for (const product_id of product_ids) {
      const product = products[product_id]

      const $option = document.createElement('option')
      $option.setAttribute('value', product_id)
      $option.textContent = product.name

      $select.appendChild($option)
    }
  }

  const reset_products = () => {
    remove_all_children(
      $element.search_brands.select.products
    )
  }

  // ---------------------------------------------------------------------------

  const populate_shades = (brand_id, product_id) => {
    reset_shades()

    const $select   = $element.search_brands.select.shades
    const shades    = static_data.brands[brand_id].products[product_id].shades
    const shade_ids = Object.keys(shades).sort((a_id, b_id) => {
      const a_name = shades[a_id].name
      const b_name = shades[b_id].name
      return a_name.localeCompare(b_name)
    })

    // heading
    {
      const $option = document.createElement('option')
      $option.setAttribute('value', '')
      $option.textContent = '-- Shades --'

      $select.appendChild($option)
    }

    for (const shade_id of shade_ids) {
      const shade = shades[shade_id]

      const $option = document.createElement('option')
      $option.setAttribute('value', shade_id)
      $option.textContent = shade.name

      $select.appendChild($option)
    }
  }

  const reset_shades = () => {
    remove_all_children(
      $element.search_brands.select.shades
    )
  }

  // ---------------------------------------------------------------------------

  const populate_lancome_shades = () => {
    const $select   = $element.search_lancome.select.lancome_shades
    const lancome_shade_ids = Object.keys(reversed_static_data).sort()

    // heading
    {
      const $option = document.createElement('option')
      $option.setAttribute('value', '')
      $option.textContent = '-- Lancome Shade --'

      $select.appendChild($option)
    }

    for (const lancome_shade_id of lancome_shade_ids) {
      const $option = document.createElement('option')
      $option.setAttribute('value', lancome_shade_id)
      $option.textContent = lancome_shade_id

      $select.appendChild($option)
    }

    reset_lancome_shades()
  }

  const reset_lancome_shades = () => {
    set_lancome_shade('')
  }

  const set_lancome_shade = (lancome_shade_id) => {
    const $select = $element.search_lancome.select.lancome_shades
    $select.value = lancome_shade_id
  }

  // ---------------------------------------------------------------------------

  const populate_brands_matching_selected_lancome_shade = (lancome_shade_id) => {
    reset_brands_matching_selected_lancome_shade()

    const $table  = $element.brands_matching_selected_lancome_shade.table
    const matches = reversed_static_data[lancome_shade_id]

    if (!Array.isArray(matches) || !matches.length) return

    // heading
    {
      let $tr, $th, $h2

      $tr = document.createElement('tr')
      $th = document.createElement('th')
      $th.setAttribute('colspan', '3')
      $h2 = document.createElement('h2')
      $h2.textContent = '-- Matches to Lancôme Makeup Shade: ' + lancome_shade_id + ' --'
      $th.appendChild($h2)
      $tr.appendChild($th)
      $table.appendChild($tr)

      $tr = document.createElement('tr')
      $th = document.createElement('th')
      $th.textContent = 'Brand'
      $tr.appendChild($th)
      $th = document.createElement('th')
      $th.textContent = 'Product'
      $tr.appendChild($th)
      $th = document.createElement('th')
      $th.textContent = 'Shade'
      $tr.appendChild($th)
      $table.appendChild($tr)
    }

    for (const match of matches) {
      const brand_id   = match[0]
      const product_id = match[1]
      const shade_id   = match[2]

      const brand_name   = static_data.brands[brand_id].name
      const product_name = static_data.brands[brand_id].products[product_id].name
      const shade_name   = static_data.brands[brand_id].products[product_id].shades[shade_id].name

      const $tr = document.createElement('tr')
      let $td
      $td = document.createElement('td')
      $td.textContent = brand_name
      $tr.appendChild($td)
      $td = document.createElement('td')
      $td.textContent = product_name
      $tr.appendChild($td)
      $td = document.createElement('td')
      $td.textContent = shade_name
      $tr.appendChild($td)
      $table.appendChild($tr)
    }
  }

  const reset_brands_matching_selected_lancome_shade = () => {
    remove_all_children(
      $element.brands_matching_selected_lancome_shade.table
    )
  }

  // ---------------------------------------------------------------------------

  const onchange_brand = (event) => {
    cancel_event(event)

    reset_products()
    reset_shades()
    reset_lancome_shades()
    reset_brands_matching_selected_lancome_shade()

    const brand_id = $element.search_brands.select.brands.value
    if (!brand_id) return

    populate_products(brand_id)
  }

  const onchange_product = (event) => {
    cancel_event(event)

    reset_shades()
    reset_lancome_shades()
    reset_brands_matching_selected_lancome_shade()

    const brand_id   = $element.search_brands.select.brands.value
    const product_id = $element.search_brands.select.products.value
    if (!brand_id || !product_id) return

    populate_shades(brand_id, product_id)
  }

  const onchange_shade = (event) => {
    cancel_event(event)

    reset_lancome_shades()
    reset_brands_matching_selected_lancome_shade()

    const brand_id   = $element.search_brands.select.brands.value
    const product_id = $element.search_brands.select.products.value
    const shade_id   = $element.search_brands.select.shades.value
    if (!brand_id || !product_id || !shade_id) return

    const lancome_shade_id = get_lancome_shade_id(brand_id, product_id, shade_id)
    if (!lancome_shade_id) return

    set_lancome_shade(lancome_shade_id)
    populate_brands_matching_selected_lancome_shade(lancome_shade_id)
  }

  const onchange_lancome_shade = (event) => {
    cancel_event(event)

    reset_brands()
    reset_products()
    reset_shades()
    reset_brands_matching_selected_lancome_shade()

    const lancome_shade_id = $element.search_lancome.select.lancome_shades.value
    if (!lancome_shade_id) return

    populate_brands_matching_selected_lancome_shade(lancome_shade_id)
  }

  // ---------------------------------------------------------------------------

  const add_event_listeners = () => {
    $element.search_brands.select.brands.addEventListener('change', onchange_brand)
    $element.search_brands.select.products.addEventListener('change', onchange_product)
    $element.search_brands.select.shades.addEventListener('change', onchange_shade)
    $element.search_lancome.select.lancome_shades.addEventListener('change', onchange_lancome_shade)
  }

  // ---------------------------------------------------------------------------
  // bootstrap

  populate_brands()
  populate_lancome_shades()
  add_event_listeners()
})
