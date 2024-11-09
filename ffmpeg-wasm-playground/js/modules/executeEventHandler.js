import { executeCommand } from "./transcoder.js";
import { parseFfmpegCommand } from "./commandParser.js";
import { isVideoFile, isAudioFile } from "./utils.js";

async function handleExecuteEvent() {
  const elements = getElements();
  resetOutput(elements);

  const commandArgs = parseFfmpegCommand(elements.command.value);

  elements.status.classList.remove("hidden");
  elements.progress.classList.remove("hidden");
  elements.stdout.classList.remove("hidden");

  let data = {};
  try {
    elements.output.classList.remove("hidden");

    const onProgress = (event) => {
      if (event && (typeof event === 'object') && (typeof event.progress === 'number')) {
        elements.progress.value = event.progress
      }
    }

    const onLog = (event) => {
      if (event && (typeof event === 'object') && ((event.type === 'stdout') || (event.type === 'stderr')) && event.message) {
        elements.stdout.appendChild(
          document.createTextNode(event.message + "\n")
        )
      }
    }

    data = await executeCommand(elements.input_files.files, commandArgs, onProgress, onLog);

    if (isVideoFile(commandArgs[commandArgs.length - 1])) {
      elements.video.classList.remove("hidden");
      elements.video.src = URL.createObjectURL(new Blob([data.buffer]));
      elements.video.load();
    } else if (isAudioFile(commandArgs[commandArgs.length - 1])) {
      elements.audio.classList.remove("hidden");
      elements.audio.src = URL.createObjectURL(new Blob([data.buffer]));
      elements.audio.load();
    } else {
      elements.img.classList.remove("hidden");
      elements.img.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "image/jpeg" })
      );
    }
    elements.status.innerText = "Command completed successfully.";
    elements.status.classList.remove("italic");
    elements.status.classList.add("font-bold");
  } catch (error) {
    handleError(error, elements);
  }
}

const getElements = () => {
  const input_files = document.getElementById("input_files");
  const command = document.getElementById("command");

  const output = document.getElementById("output-container");
  const status = document.getElementById("status-msg");
  const progress = document.getElementById("status-progress");
  const stdout = document.getElementById("output-stdout");
  const img = document.getElementById("output-image");
  const video = document.getElementById("output-video");
  const audio = document.getElementById("output-audio");

  return {
    input_files,
    command,

    output,
    status,
    progress,
    stdout,
    img,
    video,
    audio,
  };
};

const resetOutput = ({ output, status, progress, stdout, img, video, audio }) => {
  output.classList.add("hidden");
  status.innerText = "Running your command ...";
  status.classList.add("italic");
  status.classList.remove("font-bold");
  status.classList.add("hidden");
  if (status.classList.contains("text-red-600")) {
    status.classList.remove("text-red-600");
  }
  progress.classList.add("hidden");
  progress.value = 0
  stdout.classList.add("hidden");
  stdout.innerHTML = ''
  img.src = "";
  img.classList.add("hidden");
  video.classList.add("hidden");
  video.src = "";
  audio.classList.add("hidden");
  audio.src = "";
};

const handleError = (error, { status }) => {
  status.innerText = "An error occurred while executing the command.";
  status.classList.remove("italic");
  status.classList.add("font-bold");
  status.classList.add("text-red-600");
  console.error(error);
};

export { handleExecuteEvent };
