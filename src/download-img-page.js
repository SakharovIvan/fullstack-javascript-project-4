import fs from "fs";

const downloadIMG = (url, html, path) => {
  const images = findAllIMG(html);
  if (images.length === 0) {
    return;
  }
  fs.mkdir(
    `/home/hexlet/fullstack-javascript-project-4/${path}_files`,
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );

  const prom = images.map(([index, el]) => {
    const filename = IMGname.exec(el);
    downloadImage(
      `${url}${el}`,
      `/home/hexlet/fullstack-javascript-project-4/${path}_files`,
      `${filename}`
    );
  });
  return Promise.all(prom).then(console.log("all promises reserved "));
};

export default downloadIMG;
