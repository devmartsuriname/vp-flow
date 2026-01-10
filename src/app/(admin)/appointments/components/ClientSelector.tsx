import { Form } from 'react-bootstrap'
import { useClients } from '../../clients/hooks'
import { getClientDisplayName } from '../../clients/types'

type ClientSelectorProps = {
  value: string
  onChange: (value: string) => void
  isInvalid?: boolean
  disabled?: boolean
}

export default function ClientSelector({
  value,
  onChange,
  isInvalid,
  disabled,
}: ClientSelectorProps) {
  const { data: clients = [], isLoading } = useClients()

  return (
    <Form.Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      isInvalid={isInvalid}
      disabled={disabled || isLoading}
    >
      <option value="">
        {isLoading ? 'Loading clients...' : 'Select a client'}
      </option>
      {clients.map((client) => (
        <option key={client.id} value={client.id}>
          {getClientDisplayName(client)} 
          {client.client_type === 'organization' ? ' (Org)' : ''}
        </option>
      ))}
    </Form.Select>
  )
}
