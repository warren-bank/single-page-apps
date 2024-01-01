(function(){

  var run_htaccess_test = function() {
    var test_data    = get_test_data()
    var test_results = window.htaccess_tester(test_data)

    display_test_results(test_results)
  }

  var get_test_data = function() {
    return {
      "url":       document.getElementById('url'     ).value,
      "htaccess":  document.getElementById('htaccess').value,
      "variables": {
        "server":           get_variables( document.getElementById('server-variables'         ) ),
        "environment":      get_variables( document.getElementById('environment-variables'    ) ),
        "ssl-environment":  get_variables( document.getElementById('ssl-environment-variables') ),
        "http-header":      get_variables( document.getElementById('http-header-variables'    ) )
      }
    }
  }

  var get_variables = function(container) {
    var variables   = {}
    var name_inputs = container.querySelectorAll(':scope input.variable-name')
    var name_input, var_name, value_input, var_value

    for (var i=0; i < name_inputs.length; i++) {
      name_input = name_inputs[i]
      var_name   = name_input.value
      if (!var_name) continue

      value_input = name_input.parentNode.parentNode.querySelector(':scope input.variable-value')
      if (!value_input) continue
      var_value = value_input.value
      if (!var_value) continue

      variables[var_name] = var_value
    }

    return variables
  }

  var display_test_results = function(test_results) {
    var container = document.querySelector('.tester-container > .results-container')

    while(container.childNodes.length) {
      container.removeChild(container.childNodes[0])
    }

    if (!test_results || !test_results.success) return

    container.appendChild(
      get_template('tpl-results-container')
    )

    container.querySelector(':scope #output-url').value = (test_results.result && test_results.result.url) || document.getElementById('url').value

  /*
   * -----------------------------------
    return debug_rule_results(
      container.querySelector(':scope > .results'),
      test_results.log
    )
   * -----------------------------------
   */

    display_rule_results(
      container.querySelector(':scope > .results'),
      test_results.log
    )

    log_test_results(test_results)
  }

  var debug_rule_results = function(container, rule_results) {
    container.innerHTML = '<pre>' + JSON.stringify(rule_results, null, 2) + '</pre>'
  }

  var log_test_results = function(test_results) {
    console.log(
      JSON.stringify(test_results, null, 2)
    )
  }

  var display_rule_results = function(container, rule_results) {
    if (!rule_results || !Array.isArray(rule_results)) return

    var rule_result, status, line_number, value, messages
    var rule_result_element, is_passthrough
    var is_finished = false

    for (var i=0; i < rule_results.length; i++) {
      rule_result    = rule_results[i]
      line_number    = i + 1
      value          = rule_result.text
      messages       = []
      is_passthrough = false

      if (is_finished)
        status = 'was-not-processed'
      else if (rule_result.is_skipped)
        status = 'was-not-processed'
      else if (!rule_result.is_valid)
        status = 'was-invalid'
      else if (!rule_result.is_match)
        status = 'was-not-met'
      else
        status = 'was-met'

      if (rule_result.is_condition) { // RewriteCond
        if (rule_result.is_valid && rule_result.is_match) {
          messages.push('This condition was met.')
        }
        else if (!rule_result.is_valid) {
          if (Array.isArray(rule_result.errors) && rule_result.errors.length) {
            messages = format_error_messages(rule_result.errors)
          }
        }
        else {
          messages.push('This condition was not met.')
        }
      }
      else { // RewriteRule
        if (rule_result.is_skipped) {
          messages.push('This rule was skipped.')
        }
        else if (rule_result.is_valid && rule_result.is_match) {
          if (rule_result.result && rule_result.result.url) {
            messages.push('The new url is <code>' + rule_result.result.url + '</code>')

            if (rule_result.is_passthrough && Array.isArray(rule_result.passthrough)) {
              messages.push('Re-parsing the document with this new url because of the PT in your RewriteRule options.')
              is_passthrough = true
            }
            else if (rule_result.is_redirect && rule_result.result && rule_result.result.status_code) {
              messages.push('Test are stopped, a redirect will be made with status code <code>' + rule_result.result.status_code + '</code>')
              is_finished = true
            }
          }
          if (rule_result.is_last) {
            messages.push('The tests are stopped because of the L in your RewriteRule options.')
            is_finished = true
          }
        }
        else if (!rule_result.is_valid) {
          if (Array.isArray(rule_result.errors) && rule_result.errors.length) {
            messages = format_error_messages(rule_result.errors)
          }
        }
        else {
          messages.push('This rule was not met.')
        }
      }

      rule_result_element = get_rule_result(status, line_number, value, messages)
      container.appendChild(rule_result_element)

      if (is_passthrough) {
        // recursive nesting..

        display_rule_results(
          rule_result_element,
          rule_result.passthrough
        )
      }
    }
  }

  var format_error_messages = function(errors) {
    var messages = errors

    var invalid_variable_regex = /(not (?:resolved|supported): )(.+)$/
    messages = messages.map(function(msg) {
      return msg.replace(invalid_variable_regex, '$1<code>$2</code>')
    })

    return messages
  }

  var get_rule_result = function(status, line_number, value, messages) {
    if (!messages)
      messages = []
    if (!Array.isArray(messages))
      messages = [String(messages)]

    var rule_message = get_template('tpl-rule-result').querySelector(':scope > .rule-result')

    rule_message.classList.add(status)
    rule_message.querySelector(':scope > .line-number').textContent = line_number
    rule_message.querySelector(':scope > .line.value' ).textContent = value

    var messages_container = rule_message.querySelector(':scope > .line.message')
    var message

    for (var i=0; i < messages.length; i++) {
      message = document.createElement('div')
      message.innerHTML = messages[i]

      messages_container.appendChild(message)
    }

    return rule_message
  }

  var get_template = function(id) {
    var template = document.getElementById(id)

    return template.content.cloneNode(true)
  }

  window.run_htaccess_test = run_htaccess_test

})()
