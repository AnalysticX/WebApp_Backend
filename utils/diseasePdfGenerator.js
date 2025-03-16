import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export const diseasePdfGenerator = (diseases) => {
  const pdfDoc = new PDFDocument();
  const stream = new PassThrough();

  pdfDoc.pipe(stream);
  pdfDoc.fontSize(20).text("Hospital Name: Dummy", { align: "center" });
  pdfDoc.moveDown();
  pdfDoc
    .fontSize(12)
    .text("Disease Name | Total Cases | Active Cases | Chronic Cases | Trend", {
      underline: true,
    });
  pdfDoc.moveDown();

  diseases.forEach((disease) => {
    pdfDoc.text(
      `${disease.diseaseName} | ${disease.totalCases} | ${disease.activeCases} | ${disease.chronicCases} | ${disease.trend}`
    );
    pdfDoc.moveDown();
  });

  pdfDoc.end();
  return stream;
};
