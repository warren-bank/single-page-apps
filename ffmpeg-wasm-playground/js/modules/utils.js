const videoFileExtensions = ["webm", "ogg", "mov", "mp4"];
const audioFileExtensions = ["aac", "flac", "mp3", "wav"];

const isVideoFile = (fileName) =>
  videoFileExtensions.includes(fileName.split(".")[1].trim());

const isAudioFile = (fileName) =>
  audioFileExtensions.includes(fileName.split(".")[1].trim());

export { isVideoFile, isAudioFile };
