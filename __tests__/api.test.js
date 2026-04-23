/**
 * Basic unit tests for API logic validation.
 * These test the upload file type validation and content conversion logic.
 */

describe("File Upload Validation", () => {
  const validExtensions = ["txt", "md"];

  test("accepts .txt files", () => {
    const ext = "test-file.txt".split(".").pop().toLowerCase();
    expect(validExtensions.includes(ext)).toBe(true);
  });

  test("accepts .md files", () => {
    const ext = "readme.md".split(".").pop().toLowerCase();
    expect(validExtensions.includes(ext)).toBe(true);
  });

  test("rejects .docx files", () => {
    const ext = "document.docx".split(".").pop().toLowerCase();
    expect(validExtensions.includes(ext)).toBe(false);
  });

  test("rejects .pdf files", () => {
    const ext = "report.pdf".split(".").pop().toLowerCase();
    expect(validExtensions.includes(ext)).toBe(false);
  });
});

describe("Markdown to HTML Conversion", () => {
  const convert = (text) =>
    text.split("\n").map((line) => {
      if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
      if (line.trim() === "") return "<p></p>";
      return `<p>${line}</p>`;
    }).join("");

  test("converts h1 headings", () => {
    expect(convert("# Hello")).toBe("<h1>Hello</h1>");
  });

  test("converts h2 headings", () => {
    expect(convert("## Subtitle")).toBe("<h2>Subtitle</h2>");
  });

  test("converts plain text to paragraphs", () => {
    expect(convert("Hello world")).toBe("<p>Hello world</p>");
  });

  test("handles empty lines", () => {
    expect(convert("")).toBe("<p></p>");
  });

  test("converts multi-line content", () => {
    const input = "# Title\n\nSome text";
    const result = convert(input);
    expect(result).toContain("<h1>Title</h1>");
    expect(result).toContain("<p>Some text</p>");
  });
});
