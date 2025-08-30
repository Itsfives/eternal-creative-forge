
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Link, List, Image, Eye } from "lucide-react";
import DOMPurify from 'dompurify';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormat = (format: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        break;
      case 'link':
        newText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'list item'}`;
        break;
      case 'image':
        newText = `![alt text](image-url)`;
        break;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    onChange(newContent);
  };

  return (
    <div className="border rounded-lg">
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormat('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormat('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormat('link')}
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormat('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormat('image')}
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
        >
          <Eye className="h-4 w-4 mr-1" />
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>
      
      {isPreview ? (
        <div className="p-4 min-h-[200px] prose prose-sm max-w-none">
          {content ? (
            <div dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(
                content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" rel="noopener noreferrer">$1</a>')
                  .replace(/^- (.*$)/gm, '<li>$1</li>')
                  .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-6">$1</ul>')
                  .replace(/\n/g, '<br>'),
                {
                  ALLOWED_TAGS: ['strong', 'em', 'a', 'ul', 'li', 'br', 'p'],
                  ALLOWED_ATTR: ['href', 'class', 'rel'],
                  FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror'],
                  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input']
                }
              )
            }} />
          ) : (
            <p className="text-muted-foreground">Nothing to preview yet...</p>
          )}
        </div>
      ) : (
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[200px] border-0 resize-none focus-visible:ring-0"
        />
      )}
    </div>
  );
};

export default RichTextEditor;
