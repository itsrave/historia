const range = function* (min, max, step = 1) {
  if (max === undefined) {
    max = min;
    min = 1;
  }

  let iteration = min;
  while (iteration <= max) {
    yield iteration;
    iteration += step;
  }
};
