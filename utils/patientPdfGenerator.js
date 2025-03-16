import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export const patientPdfGenerator = (patients) => {
  const pdfDoc = new PDFDocument();
  const stream = new PassThrough();

  // Pipe the PDF document to the stream
  pdfDoc.pipe(stream);

  // Add hospital name
  pdfDoc.fontSize(20).text("Hospital Name: Dummy", { align: "center" });
  pdfDoc.moveDown();

  // Add table header
  pdfDoc
    .fontSize(12)
    .text(
      "Ayushman ID | Full Name | Age | Gender | Disease | Last Visit | Address",
      {
        underline: true,
      }
    );
  pdfDoc.moveDown();

  // Add content to the PDF in a tabular format
  patients.forEach((patient) => {
    pdfDoc.text(
      `${patient.ayushmanId} | ${patient.fullName} | ${patient.age} | ${
        patient.gender
      } | ${patient.disease} | ${
        patient.lastVisit ? patient.lastVisit.toLocaleDateString() : "N/A"
      } | ${patient.address}`
    );
    pdfDoc.moveDown();
  });

  // Finalize the PDF and end the stream
  pdfDoc.end();

  return stream;
};
