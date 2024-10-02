import axios from "axios";
import fs from "fs";
import * as cheerio from "cheerio";
import * as pathlib from "path";

const IMGname = /\/\w+\.\w{0,4}$/;
const structure = { img: [], link: [], script: [] };

const filename = (url) => {
  const myURL = new URL(url);
  const filename = myURL.href
    .split("//")[1]
    .replace(/\//g, "-")
    .replace(/\./g, "-");
  return filename;
};

const createResources = async (html, resPath, url) => {
  const $ = cheerio.load(html);

  $("img").each(function () {
    const oldValue = $(this).attr("src");
    structure.img.push(oldValue);
    const newsrc = resPath + IMGname.exec(oldValue);
    $(this).attr("src", newsrc);
  });

  $("link").each(function () {
    const oldValue = $(this).attr("href");
    structure.link.push(oldValue);
    const newhref = resPath + filename(url + oldValue);
    $(this).attr("href", newhref);
  });

  $("script").each(function () {
    const oldValue = $(this).attr("src");
    const newsrc = resPath + filename(url + oldValue);
    console.log(oldValue);
    structure.script.push({ src: oldValue, text: $(this).text() });
    $(this).attr("src", newsrc);
  });
  return $.html();
};

const downloadImage = async (imgURL, path, name) => {
  fetch(imgURL).then((response) => {
    response.blob().then((blob) => {
      blob.arrayBuffer().then((arraBuffer) => {
        const buffer = Buffer.from(arraBuffer);
        fs.writeFile(`${path}${name}`, buffer, (err) => {
          if (err) {
            console.log(err);
          }
          console.log("Res saved");
        });
      });
    });
  });
};

const gethtml = async (url) => {
  const result = axios({
    method: "get",
    url: url,
  }).then(function (response) {
    return response.data;
  });
  return result;
};

const saveJS = async (jscode, path, url) => {
  fs.writeFile(
    `${path}/${url.replace(/\//g, "-").replace(/\./g, "-")}.js`,
    jscode,
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("HTML file saved");
    }
  );
};

const saveHTML = async (html, path, url) => {
  fs.writeFile(`${path}/${filename(url)}.html`, html, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("HTML file saved");
  });
};

const mainFilePath = (url, path) => {
  return `${path}/${filename(url)}_files`;
};

export default (url, path = "") => {
  const htmlSavePath = path || pathlib.resolve(process.cwd());
  const fileSystPath = mainFilePath(url, htmlSavePath);
  gethtml(url)
    .then((res) => {
      createResources(res, fileSystPath, url).then((res) => {
        saveHTML(res, htmlSavePath, url);
      });
    })
    .then(() => {
      fs.mkdir(fileSystPath, { recursive: true }, (err) => {
        if (err) throw err;
      });
    })
    .then(() => {
      structure.img.map((img) => {
        const resURL = new URL(img, url);
        const resName = IMGname.exec(img);
        downloadImage(resURL, fileSystPath, `${resName}`);
      });

      structure.link.map((link) => {
        const resURL = new URL(link, url);
        gethtml(resURL).then((res) => {
          saveHTML(res, fileSystPath, resURL);
        });
      });

      structure.script.map((script) => {
        saveJS(script.text, fileSystPath, script.src);
      });
    });
};
