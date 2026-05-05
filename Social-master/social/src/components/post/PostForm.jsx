import { useState } from 'react'
import { usePostStore } from '../../store/postStore'

export default function PostForm() {
  const [content, setContent] = useState('')
  const { addPost, loading } = usePostStore()

  const submit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    await addPost({ content })
    setContent('')
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl p-4 shadow-sm border">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full resize-none border rounded-lg p-3 focus:outline-none focus:ring"
        rows={3}
      />
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  )
}
