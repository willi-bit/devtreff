// Semicolon-delimited UTF-8 with BOM for German Excel. Every field is quoted.
export function csvCell(value: string | number) {
  let text = String(value);
  // Neutralize spreadsheet formula prefixes, including leading whitespace.
  if (/^[\s]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function createCsv(
  headers: string[],
  rows: Array<Array<string | number>>,
) {
  return (
    "\uFEFF" +
    [headers, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n") +
    "\r\n"
  );
}
