document.addEventListener("DOMContentLoaded", (event) => {

  const openButton = document.getElementById("openModal");
  const closeButton = document.getElementById("closeModal");
  const modal = document.getElementById("imageModal");
  const image = modal.querySelector(".image");

  let isOpen, enlarged, dragging, moved;
  let x, y, startX, startY, startMouseX, startMouseY;

  function openModal() {
    if (isOpen) return;

    closeEnlarged();
    stopDragging();

    modal.classList.add("is-open");
    isOpen = true;
  }

  function closeModal() {
    if (!isOpen) return;

    modal.classList.remove("is-open");
    isOpen = false;
  }

  function openEnlarged() {
    if (enlarged) return;

    x = 0;
    y = 0;
    updatePosition();
    image.classList.add("is-enlarged");
    enlarged = true;
  }

  function closeEnlarged() {
    if (!enlarged) return;

    image.classList.remove("is-enlarged");
    enlarged = false;
  }

  function startDragging(event) {
    if (dragging) return;

    startX = x;
    startY = y;
    startMouseX = event.clientX;
    startMouseY = event.clientY;

    image.classList.add("is-dragging");
    dragging = true;
    moved = false;
  }

  function performDrag(event) {
    if (!dragging) return;

    const deltaX = event.clientX - startMouseX;
    const deltaY = event.clientY - startMouseY;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      moved = true;
    }

    x = startX + deltaX;
    y = startY + deltaY;
    updatePosition();
  }

  function stopDragging() {
    if (!dragging) return;

    image.classList.remove("is-dragging");
    dragging = false;

    if (!moved) {
      setTimeout(closeEnlarged, 0);
    }
  }

  function updatePosition() {
    validatePosition();

    image.style.setProperty("--x", `${x}px`);
    image.style.setProperty("--y", `${y}px`);
  }

  function validatePosition() {
    if (x > 0) x = 0;
    if (y > 0) y = 0;

    const rectImage = image.getBoundingClientRect()
    const rectModal = modal.getBoundingClientRect()
    const minX = -1 * Math.floor(rectImage.width - rectModal.width)
    const minY = -1 * Math.floor(rectImage.height - rectModal.height)
    if (x < minX) x = minX
    if (y < minY) y = minY
  }

  function cancelEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  openButton.addEventListener("click", (event) => {
    cancelEvent(event);
    openModal();
  }, true);

  closeButton.addEventListener("click", (event) => {
    cancelEvent(event);
    closeModal();
  }, true);

  document.addEventListener("click", (event) => {
    if (
      isOpen &&
      !modal.contains(event.target) &&
      (event.target !== openButton)
    ) {
      if (enlarged && dragging)
        stopDragging();
      else
        closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  image.addEventListener("click", (event) => {
    cancelEvent(event);
    if (!enlarged) {
      openEnlarged();
    }
  }, true);

  image.addEventListener("mousedown", (event) => {
    if (!enlarged) return;
    cancelEvent(event);
    startDragging(event);
  }, true);

  image.addEventListener("mousemove", (event) => {
    if (!enlarged || !dragging) return;
    performDrag(event);
  });

  image.addEventListener("mouseup", (event) => {
    if (!enlarged || !dragging) return;
    cancelEvent(event);
    stopDragging();
  }, true);

})
