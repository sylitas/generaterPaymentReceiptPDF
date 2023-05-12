const pdf = require("pdf-creator-node");

exports.convertHTML2PDF = async (template, data, outputPath) => {
  try {
    const doc = { html: template, data, path: outputPath }

    const opts = {
      format: "A5",
      orientation: "portrait",
      border: { right: "5mm", left: "5mm", top: "5mm" }
    }

    await pdf.create(doc, opts);
  } catch (error) {
    console.log('😎 Sylitas | Error :', error);
    throw new Error('There was a problem when generate PDF')
  }
}
