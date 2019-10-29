import copy from 'copy-to-clipboard';

export function copyToClipboard(text: string, options?: { debug: boolean, message: string }) {
  return copy(text, options);
}
