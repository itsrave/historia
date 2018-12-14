const fileName = window.location.hash || "fallback",
      filePath = `../pdf/${fileName}.pdf`,
      pdfId = "pdf";

document.getElementById(pdfId).src = filePath;
