import React, { useState } from 'react';

const DragAndDrop = () => {
  const [deviceType, setDeviceType] = useState("");
  const [initialX, setInitialX] = useState(0);
  const [initialY, setInitialY] = useState(0);
  const [currentElement, setCurrentElement] = useState("");
  const [moveElement, setMoveElement] = useState(false);

  const dragStart = (e) => {
    if (isTouchDevice()) {
      setInitialX(e.touches[0].clientX);
      setInitialY(e.touches[0].clientY);
      setMoveElement(true);
      setCurrentElement(e.target);
    } else {
      e.dataTransfer.setData("text", e.target.id);
    }
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const touchMove = (e) => {
    if (moveElement) {
      e.preventDefault();
      let newX = e.touches[0].clientX;
      let newY = e.touches[0].clientY;
      currentElement.style.top = currentElement.offsetTop - (initialY - newY) + "px";
      currentElement.style.left = currentElement.offsetLeft - (initialX - newX) + "px";
      setInitialX(newX);
      setInitialY(newY);
    }
  };

  const drop = (e) => {
    e.preventDefault();
    if (isTouchDevice()) {
      setMoveElement(false);
      const currentDropBound = dropContainer.getBoundingClientRect();
      if (
        initialX >= currentDropBound.left &&
        initialX <= currentDropBound.right &&
        initialY >= currentDropBound.top &&
        initialY <= currentDropBound.bottom
      ) {
        currentElement.classList.add("hide");
        dropContainer.insertAdjacentHTML(
          "afterbegin",
          '<div id="draggable-object"></div>'
        );
      }
    } else {
      if (e.target.id === "drop-point") {
        currentElement.setAttribute("draggable", "false");
        currentElement.classList.add("hide");
        e.target.insertAdjacentHTML(
          "afterbegin",
          '<div id="draggable-object"></div>'
        );
      }
    }
  };

  const isTouchDevice = () => {
    try {
      document.createEvent("TouchEvent");
      setDeviceType("touch");
      return true;
    } catch (e) {
      setDeviceType("mouse");
      return false;
    }
  };

  return (
    <div>
      <div
        id="draggable-object"
        draggable="true"
        onDragStart={dragStart}
        onTouchStart={dragStart}
        onTouchEnd={drop}
        onTouchMove={touchMove}
      >
        Drag me!
      </div>
      <div
        id="drop-point"
        onDragOver={dragOver}
        onDrop={drop}
      >
        Drop point
      </div>
    </div>
  );
};

export default DragAndDrop;
