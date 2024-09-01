import * as pdfjsLib from "pdfjs-dist";
import path from "path";
import fs from "fs";





const __dirname = path.resolve();
const absolutePath = path.resolve( __dirname,`../pdf/65a0ef14c40fedfcf3323323_659cdc3633e46249ce7abd8a.pdf`)
console.log(absolutePath)








async function extractTextFromPDF(pdfPath) {
  const pdf = await pdfjsLib.getDocument(pdfPath).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const tokenizedText = await page.getTextContent();
    const strings = tokenizedText.items.map((token) => token.str);
    text += strings.join(" ") + "\n";
  }

  return text;
}

const load_pdf_content = async (file_name) => {
//   const __dirname = path.resolve();
//   const absolutePath = path.resolve(__dirname,`../pdf/${file_name}.pdf`
//   );
  try {
    const text = await extractTextFromPDF(file_name);
    return text.replace(/ +/g, " ")
  } catch (error) {
    return error
  }
};

// const d = async () => {
//    const a = await load_pdf_content('65a0ef14c40fedfcf3323323_659cdc3633e46249ce7abd8a');

//    console.log(a)
// }
// d()
   export default load_pdf_content
