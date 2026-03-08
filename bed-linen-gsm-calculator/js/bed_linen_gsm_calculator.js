(function(){

  const calculate_gsm = (input_width, input_length, input_weight, imperial_units) => {
    input_width  = Number(input_width)
    input_length = Number(input_length)
    input_weight = Number(input_weight)

    if (
      !validate_input(input_width)  ||
      !validate_input(input_length) ||
      !validate_input(input_weight)
    ) return 0

    const linen_width_meter  = convert_distance_units_to_meter(input_width, imperial_units)
    const linen_length_meter = convert_distance_units_to_meter(input_length, imperial_units)
    const linen_weight_gram  = convert_weight_units_to_gram(input_weight, imperial_units)

    return (linen_weight_gram / (linen_width_meter * linen_length_meter))
  }

  const validate_input = (input_number) => {
    return !!input_number && !isNaN(input_number) && (input_number > 0)
  }

  const convert_distance_units_to_meter = (input_distance, imperial_units) => {
    if (imperial_units) {
      // meters = (input_distance inches) * (0.0254 meters/inches)
      return (input_distance * 0.0254)
    }
    else {
      // meters = (input_distance cm) * (0.01 meters/cm)
      return (input_distance * 0.01)
    }
  }

  const convert_weight_units_to_gram = (input_weight, imperial_units) => {
    if (imperial_units) {
      // grams = (input_weight ounces) * (28.34952 grams/ounces)
      return (input_weight * 28.34952)
    }
    else {
      // grams = (input_weight grams)
      return input_weight
    }
  }

  window.calculate_gsm = calculate_gsm

})()
