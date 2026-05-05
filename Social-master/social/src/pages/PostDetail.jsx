import { useParams } from 'react-router-dom'

export default function PostDetail() {
  const { id } = useParams()
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Post Detail</h2>
      <p className="text-gray-600">Post ID: {id}</p>
    </div>
  )
}
