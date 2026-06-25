import PDFDocument from "pdfkit";

// Controller to generate and download notes as a PDF
export const pdfDownload = async (req, res) => {
  // Get generated notes data from request body
  const { result } = req.body;

  // Validation
  if (!result) {
    return res.status(400).json({
      error: "No content provided",
    });
  }

  // Create a new PDFDocument instance with margin as 50
  const doc = new PDFDocument({
    margin: 50,
  });

  // Tell browser that response is a PDF file instead of standard JSON or HTML.
  // This sets the MIME type of the payload so the browser handles the stream appropriately.
  res.setHeader("Content-Type", "application/pdf");

  // Crucial header for file downloads:
  // 'attachment' forces the browser to download the file directly to disk rather than
  // opening it in its built-in PDF viewer tab.
  // 'filename="..."' specifies the default name given to the downloaded file.
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="ExamNotesAI.pdf"',
  );

  // Pipe PDF stream directly to response.
  // PDFKit implements the Node.js Readable Stream interface. The Express 'res' object
  // implements the Writable Stream interface. Piping chunks the binary data directly
  // into the HTTP response stream as it's being generated, optimizing memory consumption. Basically telling it is not a temp file
  doc.pipe(res);

  // Title

  // Set the current font size to 20 points and write the main heading text.
  // The options object overrides default positioning to center-align the text horizontally.
  doc.fontSize(20).text("ExamNotes AI", {
    align: "center",
  });

  // Inserts a blank vertical space equivalent to the height of the current font
  // size line height to prevent overlapping.
  doc.moveDown();

  // Dynamically insert the importance rating, resetting font size to 14 points first.
  doc.fontSize(14).text(`Importance: ${result.importance}`);

  doc.moveDown();

  // Sub Topics Section

  doc.fontSize(16).text("Sub Topics");
  doc.moveDown(0.5); // Move down by half a line height for tight, clean spacing.

  // result.subTopics is an object where keys are star levels (e.g., "5 Star")
  // and values are arrays of topic names. Object.entries converts this into key-value pairs.
  Object.entries(result.subTopics).forEach(([star, topics]) => {
    doc.moveDown(0.5);

    // Print the star category header
    doc.fontSize(13).text(`${star} Topics:`);

    // Iterate through the array of topics under this star rating and print them as bullets
    topics.forEach((t) => {
      doc.fontSize(12).text(` • ${t}`);
    });
  });

  doc.moveDown();

  // Notes Section

  doc.fontSize(16).text("Notes");
  doc.moveDown(0.5);

  // Remove markdown symbols before writing to PDF.
  // PDFKit does not natively render markdown syntax (like # or *).
  doc.fontSize(12).text(result.notes.replace(/[#*]/g, ""));

  doc.moveDown();

  // Revision Points Section

  doc.fontSize(16).text("Revision Points");
  doc.moveDown(0.5);

  // Map over each point string in the revision array and render it with a bullet prefix
  result.revisionPoints.forEach((p) => {
    doc.fontSize(12).text(` • ${p}`);
  });

  doc.moveDown();

  // Important Questions Section

  doc.fontSize(16).text("Important Questions");
  doc.moveDown(0.5);

  // Short Questions Sub-section
  doc.fontSize(13).text("Short Questions:");

  result.questions.short.forEach((q) => {
    doc.fontSize(12).text(` • ${q}`);
  });

  doc.moveDown(0.5);

  // Long Questions Sub-section
  doc.fontSize(13).text("Long Questions:");

  result.questions.long.forEach((q) => {
    doc.fontSize(12).text(` • ${q}`);
  });

  doc.moveDown(0.5);

  // Diagram Question Sub-section
  doc.fontSize(13).text("Diagram Question:");
  doc.fontSize(12).text(result.questions.diagram);

  // Finalize PDF.
  // Signals PDFKit that all data has been written to the document.
  // This closes the PDF layout engine, flushes the remaining internal buffers to the stream,
  // and automatically ends the HTTP writable response stream ('res') because of the previous .pipe().
  doc.end();
};
