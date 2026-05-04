var save_PUZ_URL_to_PDF_file = async function(url) {
    try {
        var res, data, options, xw, doc, outname;

        res  = await fetch(url);
        data = await res.arrayBuffer(); // ArrayBuffer
        data = new Uint8Array(data);    // Uint8Array

        options = {thorny: true};
        xw = JSCrossword.fromData(data, options);

        options = {show_notepad: false, num_columns: null, num_full_columns: null};
        doc = await xw.toPDF(options);

        outname = url.substring(url.lastIndexOf('/') + 1, url.length).replace(/\.puz$/i, '');
        if (xw.metadata.title) {
            outname += '_' + xw.metadata.title;
        }
        outname = outname.replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_').toLowerCase() + '.pdf';
        doc.save(outname);
    }
    catch(err) {
        console.error("PDF generation failed:", err);
        alert("Failed to create PDF. See console for details.");
    }
}
