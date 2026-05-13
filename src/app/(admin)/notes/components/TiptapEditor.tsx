import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { ButtonGroup, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useEffect } from 'react'

type ContentFormat = 'plain' | 'json'

type TiptapEditorProps = {
  value: string
  format: ContentFormat
  onChange: (value: string, format: 'json') => void
  placeholder?: string
  disabled?: boolean
}

function parseInitialContent(value: string, format: ContentFormat) {
  if (!value) return ''
  if (format === 'json') {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
  return value
}

function ToolbarButton({
  editor,
  command,
  isActive,
  icon,
  label,
  disabled,
}: {
  editor: Editor
  command: () => void
  isActive: boolean
  icon: string
  label: string
  disabled?: boolean
}) {
  return (
    <Button
      type="button"
      variant={isActive ? 'primary' : 'outline-secondary'}
      size="sm"
      onClick={command}
      disabled={disabled || !editor.isEditable}
      aria-label={label}
      title={label}
    >
      <IconifyIcon icon={icon} />
    </Button>
  )
}

export default function TiptapEditor({
  value,
  format,
  onChange,
  placeholder = 'Enter your note content...',
  disabled = false,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: parseInitialContent(value, format),
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange(JSON.stringify(json), 'json')
    },
  })

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [editor, disabled])

  if (!editor) {
    return null
  }

  return (
    <div className="tiptap-editor border rounded">
      <div className="d-flex flex-wrap gap-1 p-2 border-bottom bg-light">
        <ButtonGroup size="sm">
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon="bx:bold"
            label="Bold"
            disabled={disabled}
          />
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon="bx:italic"
            label="Italic"
            disabled={disabled}
          />
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            icon="bx:strikethrough"
            label="Strikethrough"
            disabled={disabled}
          />
        </ButtonGroup>
        <ButtonGroup size="sm">
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            icon="bx:heading"
            label="Heading 1"
            disabled={disabled}
          />
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            icon="bx:heading"
            label="Heading 2"
            disabled={disabled}
          />
        </ButtonGroup>
        <ButtonGroup size="sm">
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon="bx:list-ul"
            label="Bullet list"
            disabled={disabled}
          />
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon="bx:list-ol"
            label="Ordered list"
            disabled={disabled}
          />
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            icon="bx:quote-alt-right"
            label="Blockquote"
            disabled={disabled}
          />
        </ButtonGroup>
        <ButtonGroup size="sm">
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().undo().run()}
            isActive={false}
            icon="bx:undo"
            label="Undo"
            disabled={disabled || !editor.can().undo()}
          />
          <ToolbarButton
            editor={editor}
            command={() => editor.chain().focus().redo().run()}
            isActive={false}
            icon="bx:redo"
            label="Redo"
            disabled={disabled || !editor.can().redo()}
          />
        </ButtonGroup>
      </div>
      <EditorContent
        editor={editor}
        className="tiptap-content p-3"
        style={{ minHeight: '200px' }}
      />
    </div>
  )
}
