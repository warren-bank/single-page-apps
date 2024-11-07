async function executeCommand(file, commandArgs, onProgress, onLog) {
  const { FFmpeg } = FFmpegWASM;
  const { fetchFile } = FFmpegUtil;
  const ffmpeg = new FFmpeg();
  const { name } = file;

  if (onProgress)
    ffmpeg.on('progress', onProgress)

  if (onLog)
    ffmpeg.on('log', onLog)

  await ffmpeg.load();
  await ffmpeg.writeFile(name, await fetchFile(file));
  await ffmpeg.exec(commandArgs);
  return await ffmpeg.readFile(commandArgs[commandArgs.length - 1]);
}

export { executeCommand };
