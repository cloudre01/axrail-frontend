export default async function copyToClipboard(text) {
  if ("clipboard" in navigator) {
    return navigator.clipboard.writeText(text);
  }
  return document.execCommand("copy", true, text);
}
