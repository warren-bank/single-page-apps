var save_PUZ_URL_to_PDF_file = async function(url) {
    try {
        var res, data, xw, outname, options, doc;

        res  = await fetch(url);
        data = await res.arrayBuffer();        // ArrayBuffer
        data = arrayBufferToBinaryString(data) // same format as returned by: FileReader.readAsBinaryString()

        xw = new JSCrossword();
        xw = xw.fromData(data);

        outname = url.substring(url.lastIndexOf('/') + 1, url.length).replace(/\.puz$/i, '');
        if (xw.metadata.title) {
            outname += '_' + xw.metadata.title;
        }
        outname = outname.replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_').toLowerCase() + '.pdf';

        options = {
            "outfile": outname,
            "header_text": "",
            "header2_text": "",
            "header_align": "left",
            "header2_align": "right",
            "y_align": "alphabetic",
            "gray": 0,
            "output": "download",
            "number_pct": "30",
            "margin": 36,
            "side_margin": 36,
            "bottom_margin": 36,
            "max_clue_pt": 14,
            "header_pt": 20,
            "header2_pt": 16,
            "grid_padding": 20,
            "line_width": 0.4,
            "border_width": 0.4,
            "column_padding": 10,
            "clue_spacing": 0.30000000000000004,
            "heading_style": "bold",
            "number_style": "bold",
            "shade": true,
            "my_font": "",
            "bold_font": "",
            "header_font": "RobotoCondensed",
            "grid_font": "NunitoSans-Regular",
            "clue_font": "RobotoCondensed",
            "right_header": false,
            "subheader": false,
            "subheader_text": "",
            "subheader_pt": 14,
            "subheader_align": "left",
            "copyright": false,
            "copyright_text": "",
            "subheader_mt": 4,
            "under_title_spacing": 12,
            "header_width": 0.67,
            "columns": "auto",
            "grid_placement": "top",
            "solution": false,
            "logo": null,
            "logoX": 36,
            "logoY": 36,
            "logoS": 1,
            "header_indent": 0,
            "subheader_indent": 0
        }

        puzdata_to_pdf(xw, options);
    }
    catch(err) {
        console.error("PDF generation failed:", err);
        alert("Failed to create PDF. See console for details.");
    }
}

function arrayBufferToBinaryString(data) {
  data = new Uint8Array(data);
  var binary = '';
  for (var i = 0; i < data.byteLength; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return binary;
}
