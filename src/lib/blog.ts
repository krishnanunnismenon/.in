import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  summary: string;
  contentHtml: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents);

      // Use marked to parse the markdown body content
      const contentHtml = marked.parse(content) as string;

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        displayDate: data.displayDate || '',
        summary: data.summary || '',
        contentHtml,
      };
    });

  // Sort posts by date descending
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const contentHtml = marked.parse(content) as string;

    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      displayDate: data.displayDate || '',
      summary: data.summary || '',
      contentHtml,
    };
  } catch (err) {
    console.error(`Error loading markdown file for slug ${slug}:`, err);
    return null;
  }
}
