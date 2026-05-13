import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

type TiptapViewerProps = {
  content: string
  format: 'plain' | 'json'
}

function parseContent(content: string, format: 'plain' | 'json') {
  if (!content) return ''
  if (format === 'json') {
    try {
      return JSON.parse(content)
    } catch {
      return content
    }
  }
  return content
}

export default function TiptapViewer({ content, format }: TiptapViewerProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: parseContent(content, format),
    editable: false,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor) return
    editor.commands.setContent(parseContent(content, format))
  }, [editor, content, format])

  if (format === 'plain') {
    return (
      <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
        {content}
      </p>
    )
  }

  if (!editor) return null

  return <EditorContent editor={editor} className="tiptap-content" />
}
