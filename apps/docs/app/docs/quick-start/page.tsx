import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

async function getQuickStartContent() {
  const filePath = path.join(process.cwd(), 'content/docs/quick-start.mdx');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Remove frontmatter
  const content = fileContent.replace(/^---[\s\S]*?---\n/, '');
  
  // Process markdown to HTML
  const processedContent = await remark()
    .use(html)
    .process(content);
  
  return processedContent.toString();
}

export default async function QuickStartPage() {
  const content = await getQuickStartContent();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}