import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/** Build-time boundary: authored Markdown is content, never executable HTML. */
export function renderMarkdown(source: string): string {
  return sanitizeHtml(marked.parse(source, { async: false }), {
    allowedTags: ['p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol', 'li', 'strong', 'em', 'del', 's', 'pre', 'code', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    allowedAttributes: { a: ['href', 'title'], img: ['src', 'alt', 'title', 'width', 'height'], code: ['class'], ol: ['start'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'] },
    allowedClasses: { code: ['language-*'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowedSchemesByTag: { img: ['https', 'http'] },
    allowProtocolRelative: false,
  });
}
