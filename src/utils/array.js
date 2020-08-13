export const shuffledArray = (array) => {
  return array
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
};

export const arraySum = (array) => {
  return array.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
};

export const arrayAverage = (array) => {
  const len = array.length;
  const sum = arraySum(array);
  return len === 0 ? 0 : sum / len;
};

export const computedArrayChunk = (array, chunkNum, compute) => {
  const len = array.length;
  const size = Math.floor(len / chunkNum);
  const rem = len % chunkNum;

  // If array length is less than chunk num, insert stuffing at the end of the array
  let stuffing = [];
  if (len < chunkNum) {
    stuffing = new Array(chunkNum - len).fill(compute([]));
  }

  return array
    .reduce((acc, value, index) => {
      if (index < (size + 1) * rem) {
        if (index % (size + 1)) {
          return acc;
        } else {
          return [...acc, compute(array.slice(index, index + (size + 1)))];
        }
      } else {
        if ((index - rem) % size) {
          return acc;
        } else {
          return [...acc, compute(array.slice(index, index + size))];
        }
      }
    }, [])
    .concat(stuffing);
};
