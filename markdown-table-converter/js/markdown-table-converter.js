(function(){

  const convert_html_table_to_markdown_table = (html_table, filter_column_indices, has_column_headings, should_add_whitespace) => {
    let rows
    rows = extract_rows_from_html_table(html_table)
    rows = filter_columns(rows, filter_column_indices)
    return format_rows_to_markdown(rows, has_column_headings, should_add_whitespace)
  }

  const convert_token_separated_list_to_markdown_table = (token_separated_list, token_regex, filter_column_indices, has_column_headings, should_add_whitespace) => {
    let rows
    rows = extract_rows_from_token_separated_list(token_separated_list, token_regex)
    rows = filter_columns(rows, filter_column_indices)
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

  const filter_columns = (rows, filter_column_indices) => {
    if (!filter_column_indices) return rows

    filter_column_indices = filter_column_indices.split(',').map(val => parseInt(val.trim(), 10)).filter(val => !isNaN(val)).sort((a,b) => b-a)
    if (!filter_column_indices.length) return rows

    const filtered_rows = []
    for (let old_row of rows) {
      const new_row = []

      for (let i = (old_row.length - 1); i >= 0; i--) {
        if (filter_column_indices.indexOf(i) === -1) {
          new_row.unshift(old_row[i])
        }
      }

      if (new_row.length)
        filtered_rows.push(new_row)
    }

    return filtered_rows
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
