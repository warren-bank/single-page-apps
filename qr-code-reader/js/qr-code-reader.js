(function(){

  const read_qr_code = (input_file_element, output_img_element) => {
    return new Promise((resolve, reject) => {
      if (!input_file_element || !input_file_element.files || !input_file_element.files.length)
        return reject(new Error('QR Code Image is required'))

      if (!output_img_element || !(output_img_element instanceof HTMLImageElement))
        return reject(new Error('output HTMLImageElement is required'))

      if (!ZXingBrowser || !ZXingBrowser.BrowserQRCodeReader)
        return reject(new Error('ZXing Browser library is required'))

      const file = input_file_element.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async () => {
        try {
          const data_url = reader.result
          output_img_element.src = data_url

          const codeReader = new ZXingBrowser.BrowserQRCodeReader()
          const resultImage = await codeReader.decodeFromImageElement(output_img_element)
          resolve(resultImage)
        }
        catch(e) {
          reject(e)
        }
      }

      reader.onerror = reject
    })
  }

  window.read_qr_code = read_qr_code

})()
