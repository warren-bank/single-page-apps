(function(){

  const is_array_sorted = (arr, comparator) => {
    // An empty array or an array with a single element is considered sorted.
    if (arr.length <= 1) {
      return true
    }

    // Iterate through the array up to the second-to-last element.
    for (let i = 0; i < arr.length - 1; i++) {
      const a = arr[i]
      const b = arr[i + 1]
      const order = comparator(a, b)

      if (order > 0)
        return false
    }

    return true
  }

  window.is_array_sorted = is_array_sorted

})()
