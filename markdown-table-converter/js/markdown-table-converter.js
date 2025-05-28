(function(){

  const convert_html_table_to_markdown_table = (html_table, has_column_headings, should_add_whitespace) => {
    const rows = extract_rows_from_html_table(html_table)
    return format_rows_to_markdown(rows, has_column_headings, should_add_whitespace)
  }

  const convert_token_separated_list_to_markdown_table = (token_separated_list, token_regex, has_column_headings, should_add_whitespace) => {
    const rows = extract_rows_from_token_separated_list(token_separated_list, token_regex)
    return format_rows_to_markdown(rows, has_column_headings, should_add_whitespace)
  }

  // data types:
  //   rows = array of row
  //   row  = array of string (each string is a column value)

  const extract_rows_from_html_table = (html_table) => {
    const rows = []

    const $div = document.createElement('div')
    $div.innerHTML = html_table

    const $table = $div.querySelector(':scope table')
    if (!$table) return rows

    const $trs = $table.querySelectorAll(':scope tr')
    if (!$trs || !$trs.length) return rows

    for (let $tr of $trs) {
      const cols = []

      for (let el of $tr.children) {
        if ((el.tagName === 'TD') || (el.tagName === 'TH')) {
          cols.push(el.textContent.trim())
        }
      }

      if (cols.length)
        rows.push(cols)
    }

    return rows
  }

  const extract_rows_from_token_separated_list = (token_separated_list, token_regex) => {
    const rows = []

    const tsl_lines = token_separated_list.split(/[\r\n]+/)
    const tsl_regex = new RegExp('\\s*' + token_regex + '\\s*')

    for (let line of tsl_lines) {
      line = line.trim()
      if (!line) continue

      const cols = line.split(tsl_regex)
      rows.push(cols)
    }

    return rows
  }

  const format_rows_to_markdown = (rows, has_column_headings, should_add_whitespace) => {
    const markdown_lines = []
    let row, markdown_line

    if (should_add_whitespace)
      add_whitespace(rows)

    for (let i=0; i < rows.length; i++) {
      row = rows[i]
      markdown_line = '| ' + row.join(' | ') + ' |'

      markdown_lines.push(markdown_line)

      if ((i === 0) && (has_column_headings)) {
        markdown_lines.push(markdown_line.replace(/[^|]/g, '-'))
      }
    }

    return markdown_lines.join("\n")
  }

  const add_whitespace = (rows) => {
    const col_widths = []

    // 1st pass: determine column widths
    for (let row of rows) {
      for (let i=0; i < row.length; i++) {
        if (
          (col_widths.length <= i) ||
          (!col_widths[i]) ||
          (col_widths[i] < row[i].length)
        ) {
          col_widths[i] = row[i].length
        }
      }
    }

    // 2nd pass: add whitespace
    for (let row of rows) {
      for (let i=0; i < row.length; i++) {
        const pad_count = col_widths[i] - row[i].length
        if (pad_count > 0) {
          const pad_value = (' ').repeat(pad_count)
          row[i] += pad_value
        }
      }
    }
  }

  window.convert_html_table_to_markdown_table = convert_html_table_to_markdown_table
  window.convert_token_separated_list_to_markdown_table = convert_token_separated_list_to_markdown_table

})()
