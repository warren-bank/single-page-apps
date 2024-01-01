document.addEventListener('DOMContentLoaded', function() {
  var cancel_event = function(event) {
    event.stopPropagation()
    event.preventDefault()
  }

  // toggle: advanced-fields
  document
    .querySelector('.tester-container > .form-container.basic > #buttons > a.advanced-fields-toggle')
    .addEventListener('click', function(event) {
      cancel_event(event)
      document.querySelector('.tester-container > .form-container').classList.toggle('basic')
    })

  // run: test
  document
    .querySelector('.tester-container > .form-container > #buttons > button')
    .addEventListener('click', function(event) {
      cancel_event(event)
      window.run_htaccess_test()
    })

  document.addEventListener('click', function(event) {
    var el = event.target

    if (el instanceof HTMLAnchorElement) {
      if (el.classList.contains('add-variable')) {
        cancel_event(event)
        var listElement = el.parentNode
        add_variable(listElement)
        return
      }
      if (el.classList.contains('remove-variable')) {
        cancel_event(event)
        var variableElement = el.parentNode
        var listElement = variableElement.parentNode
        remove_variable(listElement, variableElement)
        return
      }
    }
  })

  var add_variable = function(listElement) {
    var template = listElement.querySelector(':scope > template')

    listElement.appendChild(
      template.content.cloneNode(true)
    )
  }

  var remove_variable = function(listElement, variableElement) {
    listElement.removeChild(
      variableElement
    )

    // ensure that at least 1 variable is always added
    if (!listElement.querySelector(':scope .input-container')) {
      add_variable(listElement)
    }
  }

  // initialize: add 1 variable to each list
  ;(function(){
    var listElements = document.querySelectorAll('.tester-container > .form-container > #advanced-fields > .variable-list')

    for (var i=0; i < listElements.length; i++) {
      add_variable(listElements[i])
    }
  })()

})
