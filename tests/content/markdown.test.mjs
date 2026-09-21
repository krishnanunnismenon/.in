import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import { renderMarkdown } from '../../src/lib/markdown.ts';

test('scripts, handlers, embeds and active CSS cannot cross Markdown boundary', () => {
 const html=renderMarkdown('<script>alert(1)</script><img src="https://example.org/a.png" onerror="alert(1)"><iframe src="https://evil.test"></iframe><svg onload="alert(1)"></svg><p style="background:url(javascript:alert(1))">Safe</p>');
 assert.doesNotMatch(html, /<script|onerror|onload|<iframe|<svg|style=/i);assert.match(html, /Safe/);
});
test('unsafe URL schemes, entities and protocol-relative links are rejected',()=>{
 for(const url of ['javascript:alert(1)','jav&#x61;script:alert(1)','java&#10;script:alert(1)','data:text/html,evil','//evil.test']) assert.doesNotMatch(renderMarkdown(`<a href="${url}">read</a>`),/href=/);
 assert.match(renderMarkdown('[Contact](mailto:hello@krishnanunni.in)'),/href="mailto:/);
 assert.match(renderMarkdown('[Home](/)'),/href="\/"/);
});
test('existing essays retain their rendered content exactly',()=>{
 for(const name of fs.readdirSync('content/posts')){
  const {content}=matter(fs.readFileSync(`content/posts/${name}`,'utf8'));
  // Sanitization normalizes quote entities without changing rendered text or tags.
  const quotes = html => html.replaceAll('&#39;', "'").replaceAll('&quot;', '"');
  assert.equal(quotes(renderMarkdown(content)),quotes(marked.parse(content)),name);
 }
});
