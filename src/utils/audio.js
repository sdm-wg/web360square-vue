export const audioAxios = (axios, url, successCallback, errorCallback) => {
  axios
    .get(url, { responseType: "arraybuffer" })
    .then((response) => successCallback(response))
    .catch((error) => errorCallback(error));
};
