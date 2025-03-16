import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export const reportPdfGenerator = (reports) => {
  const pdfDoc = new PDFDocument();
  const stream = new PassThrough();

  // Pipe the PDF document to the stream
  pdfDoc.pipe(stream);

  // Add hospital name
  pdfDoc.fontSize(20).text("Hospital Name: Dummy", { align: "center" });
  pdfDoc.moveDown();

  // Add table header
  pdfDoc.fontSize(12).text("Report Name | Patient ID | Start Time | End Time", {
    underline: true,
  });
  pdfDoc.moveDown();

  // Add content to the PDF in a tabular format
  reports.forEach((report) => {
    pdfDoc.text(
      `${report.reportName} | ${
        report.generatedBy
      } | ${report.timeFrameStart.toLocaleString()} | ${report.timeFrameEnd.toLocaleString()}`
    );
    pdfDoc.moveDown();
  });

  // Finalize the PDF and end the stream
  pdfDoc.end();

  return stream;
};
