/*global showClassroom, showInitialState, completer, getClassroomId,
  rescheduleReset */

let targetElements = {
  container:      document.getElementById("targetInfo"),
  previousButton: document.getElementById("targetPrevious"),
  nextButton:     document.getElementById("targetNext"),
  nameElement:    document.getElementById("targetName"),
};

let targetChangerState = {
  targets: [],
  currentTarget: 0,
};

const setTargetsVisibility = (visibility) => {
  const display = ((visibility) ? "block" : "none");
  targetElements.container.style.display = display;
  if (!visibility) {
    document.getElementById("showTimeTable").style.display = display;
  }
};

const buttonSetEnableState = (button, state) =>
      button.classList[((state) ? "remove" : "add")]("buttonDisabled");

const displayTarget = (index) => {
  const {targets} = targetChangerState,
        firstIndex = 0,
        lastIndex = Math.max(targets.length - 1, 0),
        targetObject = targets[index];

  if (index < firstIndex || index > lastIndex || targetObject === undefined) {
    return;
  }

  setTargetsVisibility(true);

  buttonSetEnableState(targetElements.previousButton, !(index <= firstIndex));
  buttonSetEnableState(targetElements.nextButton, !(index >= lastIndex));

  let classroomExists = showClassroom(getClassroomId(targetObject.target)),
      classroomExistsString = ((classroomExists)
                               ? ""
                               : "(brak sali na planie)");

  if (!classroomExists) {
    showInitialState();
  }

  targetElements.nameElement.textContent =
    `${targetObject.name} ${classroomExistsString}\
 (${index + 1} / ${targets.length})`;

  targetChangerState.currentTarget = index;
  rescheduleReset();
};

const updateTargets = (targets) => {
  targetChangerState.targets = targets;
  targetChangerState.currentTarget = 0;
  displayTarget(0);
};

const setTargetEventListeners = () => {
  const previousTarget = () =>
        displayTarget(targetChangerState.currentTarget - 1);
  const nextTarget = () =>
        displayTarget(targetChangerState.currentTarget + 1);

  targetElements.previousButton.addEventListener("click", previousTarget);
  targetElements.nextButton.addEventListener("click", nextTarget);

  window.addEventListener("keydown", (e) => {
    if (document.activeElement !== completer.inputElement) {
      switch (e.which) {
        case 37:                // left arrow
          previousTarget();
          break;
        case 39:                // right arrow
          nextTarget();
          break;
      }
    }
  });
};

setTargetEventListeners();
updateTargets([]);
setTargetsVisibility(false);
