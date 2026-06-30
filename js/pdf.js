import { toast } from "./storage.js";

export function initPdfActions() {
  document.querySelectorAll("[data-print]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  document.querySelectorAll("[data-download-pdf]").forEach((button) => {
    button.addEventListener("click", () => {
      if (window.html2pdf) {
        window.html2pdf().from(document.querySelector("[data-print-area]") || document.body).save("resume.pdf");
      } else {
        toast("PDF library is loading. Try print for now.");
      }
    });
  });
}
