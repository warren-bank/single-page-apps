/* -----------------------------------------------------------------------------
 * relevant documentation:
 * -----------------------------------------------------------------------------
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/deviceId
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/devicechange_event
 * -----------------------------------------------------------------------------
 */

/* -----------------------------------------------------------------------------
 * similar SPA that is helpful as a reference:
 * -----------------------------------------------------------------------------
 * https://webrtchacks.github.io/WebRTC-Camera-Resolution/
 * https://github.com/webrtcHacks/WebRTC-Camera-Resolution
 * https://github.com/webrtcHacks/adapter
 * -----------------------------------------------------------------------------
 */

const init = () => {
  let audioList, videoList, video
  let audio_deviceId, video_deviceId
  let initialize_complete = false

  const video_width  = {min: 0, max: 0, ideal: 0}
  const video_height = {min: 0, max: 0, ideal: 0}

  const initialize_dom = () => {
    audioList = document.querySelector('select#audio_device_list')
    videoList = document.querySelector('select#video_device_list')
    video     = document.querySelector('video')

    const videoDims        = document.querySelector('select#video_dimensions')
    const videoDimsMin     = document.querySelector('button#video_dimensions_min')
    const videoDimsMax     = document.querySelector('button#video_dimensions_max')
    const videoDimsIdeal   = document.querySelector('button#video_dimensions_ideal')
    const videoWidthMin    = document.querySelector('input#video_width_min')
    const videoWidthMax    = document.querySelector('input#video_width_max')
    const videoWidthIdeal  = document.querySelector('input#video_width_ideal')
    const videoHeightMin   = document.querySelector('input#video_height_min')
    const videoHeightMax   = document.querySelector('input#video_height_max')
    const videoHeightIdeal = document.querySelector('input#video_height_ideal')
    const apply            = document.querySelector('button#apply')

    audioList.addEventListener('change', () => {
      audio_deviceId = audioList.value
    })

    videoList.addEventListener('change', () => {
      video_deviceId = videoList.value
    })

    const getVideoDims = () => videoDims.value.split('x').map(val => parseInt(val, 10))

    const setVideoDims = (inputWidth, inputHeight) => {
      const [w, h] = getVideoDims()

      inputWidth.value  = w || ''
      inputHeight.value = h || ''
    }

    videoDimsMin.addEventListener('click', () => {
      setVideoDims(videoWidthMin, videoHeightMin)
    })

    videoDimsMax.addEventListener('click', () => {
      setVideoDims(videoWidthMax, videoHeightMax)
    })

    videoDimsIdeal.addEventListener('click', () => {
      setVideoDims(videoWidthIdeal, videoHeightIdeal)
    })

    apply.addEventListener('click', () => {
      video_width.min    = videoWidthMin.value    ? parseInt(videoWidthMin.value,    10) : 0
      video_width.max    = videoWidthMax.value    ? parseInt(videoWidthMax.value,    10) : 0
      video_width.ideal  = videoWidthIdeal.value  ? parseInt(videoWidthIdeal.value,  10) : 0

      video_height.min   = videoHeightMin.value   ? parseInt(videoHeightMin.value,   10) : 0
      video_height.max   = videoHeightMax.value   ? parseInt(videoHeightMax.value,   10) : 0
      video_height.ideal = videoHeightIdeal.value ? parseInt(videoHeightIdeal.value, 10) : 0

      get_stream()
    })
  }

  const finalize_dom = () => {
    if (!initialize_complete) {
      initialize_complete = true
      update_device_lists()
      navigator.mediaDevices.ondevicechange = update_device_lists
    }
  }

  const empty_element = (element) => {
    while (element.childNodes.length)
      element.removeChild(element.childNodes[0])
  }

  const get_stream = () => {
    const constraints = {}

    constraints.audio = audio_deviceId
      ? {deviceId: audio_deviceId}
      : true

    constraints.video = video_deviceId
      ? {deviceId: video_deviceId}
      : true

    if (video_deviceId) {
      if (video_width.min || video_width.max || video_width.ideal) {
        constraints.video.width = {}

        if (video_width.min)
          constraints.video.width.min = video_width.min
        if (video_width.max)
          constraints.video.width.max = video_width.max
        if (video_width.ideal)
          constraints.video.width.ideal = video_width.ideal
      }
      if (video_height.min || video_height.max || video_height.ideal) {
        constraints.video.height = {}

        if (video_height.min)
          constraints.video.height.min = video_height.min
        if (video_height.max)
          constraints.video.height.max = video_height.max
        if (video_height.ideal)
          constraints.video.height.ideal = video_height.ideal
      }
    }

    console.log('constraints for media tracks:', JSON.stringify(constraints, null, 2))

    end_stream()

    window.navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {mirror_stream(stream)})
    .catch((error) => {console.log('error:', error)})
  }

  const end_stream = () => {
    const stream = video.srcObject
    if (!stream) return

    stream.getTracks().forEach((track) => {
      track.stop()
    })
  }

  const mirror_stream = (stream) => {
    resize_video(video, stream)
    video.srcObject = stream
    video.play().catch(() => {})
    finalize_dom()
  }

  const resize_video = (video, stream) => {
    const tracks = stream.getVideoTracks()
    if (tracks.length) {
      const track = tracks[0]
      const settings = track.getSettings()

      console.log('number of video tracks:', tracks.length)
      console.log('settings for video track #1:', JSON.stringify(settings, null, 2))

      video.style.width  = settings.width  + 'px'
      video.style.height = settings.height + 'px'
    }
  }

  const update_device_lists = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      empty_element(audioList)
      empty_element(videoList)

      devices.forEach((device) => {
        if ((device.kind === 'audioinput') || (device.kind === 'videoinput')) {
          const option = document.createElement('option')
          option.value = device.deviceId
          option.textContent = device.label

          if (device.kind === 'audioinput')
            audioList.appendChild(option)
          else
            videoList.appendChild(option)
        }
      })

      update_device_list_selections()
    })
  }

  const update_device_list_selections = () => {
    audio_deviceId = update_device_list_selection(audioList, audio_deviceId)
    video_deviceId = update_device_list_selection(videoList, video_deviceId)
  }

  const update_device_list_selection = (list, old_value) => {
    let option

    if (old_value)
      option = list.querySelector(`:scope > option[value="${old_value}"]`)

    if (!option)
      option = list.options.length ? list.options[0] : null

    if (option) {
      option.selected = true

      return option.value
    }
  }

  initialize_dom()
  get_stream()
}

document.addEventListener('DOMContentLoaded', init)
