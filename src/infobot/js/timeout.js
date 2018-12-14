/*global completer, showInitialState, setTargetsVisibility, hideTimeTable */
const timeoutTime = 1000 * 45;

let resetTimeoutId = 0;

const rescheduleReset = () => {
  window.clearTimeout(resetTimeoutId);
  resetTimeoutId = window.setTimeout(
    () => {
      completer.clearInput();
      showInitialState();
      setTargetsVisibility(false);
      hideTimeTable();
      completer.inputElement.focus();
    },
    timeoutTime);
};

["keydown", "mousemove"].forEach(
  (event) => window.addEventListener(event, rescheduleReset));
