import { useMemo } from 'react';
import { Value as SlateValue } from 'slate';
import { serializeHtml } from './htmlSerializer';

const useHtmlSlateValue = (content: SlateValue | string | null) => {
  const memo = typeof content === 'string' ? content : content?.hashCode();
  const html = useMemo(() => {
    if (!content) return '';

    if (typeof content === 'string') return content;

    return serializeHtml(content);
  }, [memo]);

  return html;
};
export default useHtmlSlateValue;
