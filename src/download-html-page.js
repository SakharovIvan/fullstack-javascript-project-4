import axios from "axios";
import fs from "fs";

const gethtml = async (url) => {
  try {
    const result = axios({
      method: "get",
      url: url,
    }).then(function (response) {
      return response.data;
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};
const filename = (url) => {
  const myURL = new URL(url);
  const filename = myURL.href.slice(myURL.protocol.length).replace(/\//g, "-");
  return filename;
};

const saveHTML = async (html, path, url) => {
  try {
    fs.writeFile(`${path}/${filename(url)}.html`, html, (err) => {
      console.log("File has been writen");
    });
  } catch (error) {
    console.log(error);
  }
};
export default (url, path = "./") => {
  gethtml(url).then((res) => saveHTML(res, path, url));
};
