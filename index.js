import pdfPoppler from "pdf-poppler";

import imgToPDF from "image-to-pdf";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import Jimp from "jimp";
import zlib from "node:zlib";
import {Poppler} from "node-poppler"

import os from "os";
import crypto from "crypto";

// const pdfPath = 'https://studio-app-backend.s3.ap-south-1.amazonaws.com/903fcf6b-11e0-4b09-a5f1-48ba865245f1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAX3GHEN5N6OSRLDPE%2F20231123%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20231123T060509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiRzBFAiEAyshBXvEa6qOBK2o2uLp26ymIpn%2BkRSJbnMe7o38iRlsCIC66NtSlVOb3NvNvM3ojJlROy7cWoYfWPEeNr%2BMD1OPSKpoFCD8QABoMNTM5NDM2MDE5NTQ3IgwVpOyJss2WnOgcTh0q9wSi7zAT9mFmCjMMdhBGwAAyZcp344nLr1VvQ3h9IEK4o32sRNaY%2FCJVeAf0KS9IHTF6ardH6dBiAOxatAwNbYepSWnGvgLEA2mDn8VUJOJ%2BPwvraFSBESVVjklsTRR2%2BsOJpB3edcaB7irMPi1IGLzF4rLLN277V6v22eWryhu7HdAOM%2FU%2FoBUvXBfj6Ag1ECO%2BaYCEMOvGlqsKhqcn5KkBypeqrIFy8VZVIp9WqVywRUyKvLlTkyaLhe38a9dvb6prumk54b86dUaOkyUo2twRZV0GNlx6zIYVwUXzSzmWz%2FzBBFEeHJkwHbI1cbpKSUvNgmtfKIGt%2FyEF2kXf0tZjv3VXTd0V0LNc7I6nltS%2Fe9gX8lVtpSVWQqT%2F2qUMtk%2Ba5VXD259hTNWRY41bkPyya58CDBExjTO72rer4loTLJ1jnAP5tFe%2FVzHVAPrWUi%2FkGWEBojCDpXgidwT98%2BVJ2JzE4qJN2X9vlAiLIxaW5x9WEVPEbl8RbSXx2CzKsuAjl%2FHAcmI1QQsjEpmhOOcZUEArcemDWspFe29nMEUWqH80uMJxjmGmYw4zyyzOalKjmTGyqGz6Soa2DqCpM8Ju0Dg60G9OkEb4brW2tKuz3du7hPKqK3GH1WTOv775LhX93zKKTuxfzv6pWL9Sfe7CrvQ04O6lVmdFsy40xemjYqAlnS%2BxMT%2B5EZGFaE%2BcCnMZF8ugMfT9fXlHvMDWOAvXckGTNa0MB2lf8AEXTjJahsgdIf6VEjAxDLCNr7TkAtCvocATMTKMG8Z12EHfJU%2FpXr9b2BwpjjQ57bJ3Yn27zUHWnjNkOzL6ZZKujYuk44v5wPO2JiAzMLzI%2B6oGOpsBfaJm1ozR20T4RoZ1A%2BJhLebFHDCC5X69zu0Kexr62vXVrYj2XtjTt%2FZNyc8tHHl4kVfJYSVXRr2peHAJdcKm7aEO0L8iEXN7JDYXy9rzTSSfMv3lX5qnowZ4D%2BC9%2FRxm3TlienG7kkciYBAM6uUVU2LMuKKWIBh34TkUJ09S6wJ6aBukEF1s0A5MrRQDI3%2BFXT3fcudXRbeluu8%3D&X-Amz-Signature=7cea27ff5bbba2e62c0337d58a2b594f4636a764af40cdfb5bbaf168e20e4cf6&X-Amz-SignedHeaders=host&x-id=GetObject';
const pdfPath = "./original/test.pdf";
const outputDir = "./compressed";

async function compressUsingZlib(pdfPath, outputPath) {
  zlib.gzip(pdfPath, (err, buffer) => {
    if (!err) {
      fs.writeFileSync(`${outputPath}/compressed.zip`, buffer);
    } else {
      console.error(err);
    }
  });
}

async function readFile(pdfPath) {
  try {
    const data = fs.readFileSync(pdfPath);
    // console.log(data);
    console.log(`pdf size before compression : ${Math.round(  data.length / 1024 / 1024)} mb`
    );

    // zlib.deflate(data, { level: 9 }, (e, result) => {
    //   if (!e) {
    //     console.log(result);
    //     console.log(
    //       `pdf size after compression : ${Math.round(
    //         result.length / 1024 / 1024
    //       )} mb`
    //     );
    //   }
    // });

    const uuid = crypto.randomUUID();
    fs.writeFileSync(`./compressed/compressed-${uuid}.pdf`, data);
    await convertPdfToImage(`./compressed/compressed-${uuid}.pdf`, './compressed')
  } catch (err) {
    console.error(err);
  }
}

readFile(pdfPath);

async function convertPdfToImage(pdfPath, outputPath) {
  const opts = {
    format: "jpeg", // You can choose other formats like png or tiff
    out_dir: outputPath, // output directory path
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: null, // Specify the page number here to convert a specific page, otherwise null to convert all pages
  };
  try {
    console.log("Converting PDF to image...");
    try {
      await pdfPoppler.convert(pdfPath, opts);
    } catch (err) {
      console.log("err : ", err.message);
    }
    console.log("PDF converted to image successfully!");

    // get number of pages in
    const info = await pdfPoppler.info(pdfPath);
    console.log("info : ", info);
    const numberOfPages = parseInt(info.pages);
    // const docmentAsBytes = await fs.promises.readFile(pdfPath);
    // const pdfDoc = await PDFDocument.load(docmentAsBytes)
    // const numberOfPages = pdfDoc.getPages().length;
    console.log("number of pages : ", numberOfPages);

    // create array of images
    const pages = [];
    // Add all images to array
    for (let i = 1; i <= numberOfPages; i++) {
      pages.push(
        `./compressed/${path.basename(pdfPath, path.extname(pdfPath))}-${String(
          i
        ).padStart(String(numberOfPages).length, "0")}.jpg`
      );
    }

    // size = ppt size 16:9
    const width = info?.width_in_pts || 1280;
    const height = info?.height_in_pts || 720;

    console.log("width of first page : ", width);
    console.log("height of first page : ", height);

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(
        `compressed/${path.basename(
          pdfPath,
          path.extname(pdfPath)
        )}_compressed.pdf`,
        {
          flags: "w",
        }
      );

      imgToPDF(pages, [width, height])
        .pipe(writeStream)
        .on("finish", resolve)
        .on("error", reject);
    });

    // now write log file
    const logs = fs.createWriteStream(`logs.csv`, { flags: "a" });
    logs.write(
      `${path.basename(pdfPath, path.extname(pdfPath))}, ${Math.round(
        parseInt(info.file_size.split(" ")[0]) / 1024
      )} kb, ${Math.round(
        fs.statSync(
          `compressed/${path.basename(
            pdfPath,
            path.extname(pdfPath)
          )}_compressed.pdf`
        ).size / 1024
      )} kb\n`
    );

    // now delete all the images
    for (let i = 1; i <= numberOfPages; i++) {
      fs.unlink(
        `./compressed/${path.basename(pdfPath, path.extname(pdfPath))}-${String(
          i
        ).padStart(String(numberOfPages).length, "0")}.jpg`,
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
    }
  } catch (error) {
    console.error("Error converting PDF to image:", error);
  }
}
// convertPdfToImage(pdfPath, outputDir);
// compressUsingZlib(pdfPath, outputDir)
