export default function isEmptyTag(html: string | null): boolean {
  if (!html) {
    return true;
  }
  if (html.replace(/\s+/, '') === '<p></p>') {
    return true;
  }

  return false;
}
