import { Table, Spinner, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { format } from 'date-fns'
import type { NoteWithLink, NoteLink, NoteEntityType } from '../types'
import { getNoteDisplayTitle, ENTITY_TYPE_LABELS } from '../types'

type NotesTableProps = {
  notes: NoteWithLink[]
  isLoading: boolean
  onDelete?: (note: NoteWithLink) => void
}

// Helper to get first link from note_links (can be array or single object)
function getFirstLink(noteLinks: NoteLink | NoteLink[] | null): NoteLink | null {
  if (!noteLinks) return null
  if (Array.isArray(noteLinks)) {
    return noteLinks.length > 0 ? noteLinks[0] : null
  }
  return noteLinks
}

export default function NotesTable({ notes, isLoading, onDelete }: NotesTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading notes...
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-4">
        <IconifyIcon icon="bx:notepad" className="fs-1 text-muted mb-2" />
        <p className="text-muted mb-0">No notes found. Create your first note to get started.</p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <Table className="table-centered mb-0">
        <thead className="bg-light bg-opacity-50">
          <tr>
            <th>Title</th>
            <th>Linked To</th>
            <th>Last Updated</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => {
            const link = getFirstLink(note.note_links)
            return (
              <tr key={note.id}>
                <td>
                  <Link to={`/notes/${note.id}`} className="text-decoration-none fw-medium">
                    {getNoteDisplayTitle(note)}
                  </Link>
                </td>
                <td>
                  {link ? (
                    <Badge bg="secondary" className="text-capitalize">
                      {ENTITY_TYPE_LABELS[link.entity_type as NoteEntityType]}
                    </Badge>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  <span className="text-muted">
                    {format(new Date(note.updated_at), 'PPp')}
                  </span>
                </td>
                <td className="text-end">
                  <Link 
                    to={`/notes/${note.id}`} 
                    className="btn btn-sm btn-outline-primary me-1"
                    title="View"
                  >
                    <IconifyIcon icon="bx:show" />
                  </Link>
                  <Link 
                    to={`/notes/${note.id}/edit`} 
                    className="btn btn-sm btn-outline-secondary me-1"
                    title="Edit"
                  >
                    <IconifyIcon icon="bx:edit" />
                  </Link>
                  {onDelete && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(note)}
                      title="Delete"
                    >
                      <IconifyIcon icon="bx:trash" />
                    </Button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}
