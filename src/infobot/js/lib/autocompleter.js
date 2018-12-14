/*exported Autocompleter */
const Autocompleter = (() => {
  "use strict";

  const keys = Object.seal({
    upArrow:    38,
    downArrow:  40,
    leftArrow:  37,
    rightArrow: 39,
    enter:      13,
    tab:         9,
    escape:     27,
  });

  // TODO:
  // - add a way to show grayed out text that can be typed over
  //   - display some text when the input element is empty
  //   - maybe show rest of first completion as it's typed in
  //   - this might be very hard if not impossible to pull off
  // - consider using Sets instead of Arrays for keeping possible options

  return class Autocompleter {
    constructor ({container,
                  completions = [],
                  options = {},
                  callback = (result) => console.error(
                    `Option ${result} passed to an unspecifed callback.`)}) {
      // make an options object with defaults
      this.options = Object.assign({
        caseInsensitive: false,
        resultLimit: 0,
        emptyPlaceholder: "this should be overriden",
        highlightClass: "bugMeBecauseThisClassDoesNotExist",
        focus: false,
        onlyKnownCompletions: true,
      }, options);

      // create the completion table element
      let inputElement = document.createElement("input"),
          completionElement = document.createElement("table");

      inputElement.setAttribute("placeholder", this.options.emptyPlaceholder);

      [inputElement, completionElement].forEach(
        (element) => container.appendChild(element));

      if (this.options.focus === true) {
        inputElement.focus();
      }

      // store passed arguments in the created object
      this.inputElement = inputElement;
      this.completionElement = completionElement;
      this.completions = completions;
      this.callback = callback;

      // initialize internal state variables
      this.selectedCompletion = -1;
      this.visibleResults = [];

      // hook events and do the initial search
      window.addEventListener("keydown", (e) => this.keydownHandler(e));
      window.addEventListener("keyup", (e) => this.keyupHandler(e));
      this.redisplay();
    }

    updateCompletions (newCompletions = []) {
      this.completions = newCompletions;
      this.redisplay();
    }

    clearInput (inputElement = this.inputElement) {
      inputElement.value = "";
      this.redisplay();
    }

    clearCompletions (element = this.completionElement) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }

    clearSelection () {
      this.selectedCompletion = -1;
    }

    getOptionElement (index = this.selectedCompletion) {
      if (index !== -1) {
        return this.completionElement.rows[index].firstChild;
      } else {
        return null;
      }
    }

    selectOption (index = this.selectedCompletion) {
      if (index !== -1) {
        this.getOptionElement(index)
          .classList.add(this.options.highlightClass);
      }
    }

    deselectOption (index = this.selectedCompletion) {
      if (index !== -1) {
        this.getOptionElement(index)
          .classList.remove(this.options.highlightClass);
      }
    }

    completeToSelectedOption (index = this.selectedCompletion) {
      if (index !== -1) {
        let text = this.getOptionText(index);
        this.inputElement.value = text;
        this.redisplay();
        return text;
      } else {
        return this.inputElement.value;
      }
    }

    getOptionText (index = this.selectedCompletion) {
      if (index !== -1) {
        return this.getOptionElement(index).firstChild.textContent;
      } else {
        return false;
      }
    }

    changeOption (offset) {
      if (this.visibleResults.length < 1) {
        // do nothing when there are no completions displayed
        return;
      }

      const firstIndex = 0,
            lastIndex = this.visibleResults.length - 1;

      if (this.selectedCompletion < firstIndex) {
        // no option was chosen before, select the appropriate one and
        // highlight it
        if (offset > 0) {
          this.selectedCompletion = firstIndex;
        } else {
          this.selectedCompletion = lastIndex;
        }

        this.selectOption(this.selectedCompletion);
      } else {
        let oldIndex = this.selectedCompletion;

        this.selectedCompletion += offset;

        if (this.selectedCompletion > lastIndex ||
            this.selectedCompletion < firstIndex) {
          // went past the boundary, so it's necessary to back off
          this.selectedCompletion = oldIndex;
          return;
        } else {
          this.deselectOption(oldIndex);
          this.selectOption(this.selectedCompletion);
        }
      }
    }

    isInFocus (element = this.inputElement) {
      return document.activeElement === element;
    }

    keyupHandler (event) {
      if (this.isInFocus()) {
        switch (event.which) {
          case keys.upArrow:
            this.changeOption(-1);
            break;
          case keys.downArrow:
            this.changeOption(1);
            break;
          case keys.enter:
            let finalOption;
            if (this.options.onlyKnownCompletions) {
              if (this.completions.includes(this.inputElement.value)) {
                finalOption = this.inputElement.value;
              } else if (this.visibleResults.length > 0) {
                finalOption = this.visibleResults[
                  (this.selectedCompletion === -1
                   ? 0
                   : this.selectedCompletion)];
              } else {
                break;
              }
            } else {
              if (this.inputElement.value === this.getOptionText()) {
                finalOption = this.inputElement.value;
              } else {
                finalOption = this.completeToSelectedOption();
              }
            }
            this.callback(finalOption);
            break;
          case keys.escape:
            this.clearInput();
            break;
          default:
            this.redisplay();
            break;
        }
      }
    }

    keydownHandler (event) {
      if (this.isInFocus()) {
        switch (event.which) {
          case keys.tab:
            this.completeToSelectedOption();
            // make sure input element doesn't go out of focus
            event.preventDefault();
            break;
        }
      }
    }

    redisplay () {
      this.displayResults(this.getCompletions());
    }

    displayResults (results = [], limit = this.options.resultLimit) {
      // TOOD: consider switching the list display to <ul> (and update the
      // readme file if that's necessary)
      this.clearCompletions();
      this.clearSelection();

      this.visibleResults =
        ((limit > 0)
         ? results.slice(0, limit)
         : results.slice());
      // Clone the Array regardless, because storing a refenrence is way too
      // risky.

      this.visibleResults.forEach(
        (result, index) => {
          let cell = document.createElement("td"),
              row = this.completionElement.insertRow();
          cell.appendChild(document.createTextNode(result));
          row.appendChild(cell);
          row.addEventListener("click",
                               () => this.callback(
                                 this.completeToSelectedOption(index)));
        });
    }

    getCompletions (input = this.inputElement.value,
                    completions = this.completions,
                    caseInsensitive = this.options.caseInsensitive) {
      // TODO: consider incrementally searching through last results if that
      // makes sense — it would be more efficient

      // This would require:
      // - keeping last input
      // - checking if they have the same beginning
      // - searching over last results if possible (but they couldn't be
      //   truncated)

      // The payoff is so small that it might end up just using more resources
      // for little to no benefit.

      if (input.length !== 0) {

        if (caseInsensitive) {
          input = input.toLowerCase();
        }

        // dispatching to the right lambda instead of doing the case
        // sensitivity check every time should be more efficient even if JIT
        // can optimize out the branch
        return this.completions
          .filter(caseInsensitive
                  ? (option) => option.toLowerCase().indexOf(input) !== -1
                  : (option) => option.indexOf(input) !== -1)
          .sort((a, b) => Math.sign(a.length - b.length));

      } else {
        return completions;
      }
    }
  };
})();
