async function executeCommand(input_files, commandArgs, onProgress, onLog) {
  const { FFmpeg } = FFmpegWASM;
  const { fetchFile } = FFmpegUtil;
  const ffmpeg = new FFmpeg();

  if (onProgress)
    ffmpeg.on('progress', onProgress)

  if (onLog)
    ffmpeg.on('log', onLog)

  await ffmpeg.load();
  for (let file of input_files) {
    await ffmpeg.writeFile(file.name, await fetchFile(file));
  }
  await ffmpeg.exec(commandArgs);
  return await ffmpeg.readFile(commandArgs[commandArgs.length - 1]);
}

export { executeCommand };
