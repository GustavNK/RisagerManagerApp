'use client'

import { Card, Button } from '@/components/ui'

interface PostCardProps {
  post: {
    id: number
    title: string
    content: string
    authorName: string
    createdAt: string
    attachmentFileName?: string
    attachmentOriginalName?: string
    attachmentContentType?: string
  }
  onDownloadFile?: (post: PostCardProps['post']) => void
}

export function PostCard({ post, onDownloadFile }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className="p-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">{post.title}</h3>
          <p className="text-sm text-green-600">
            By {post.authorName} on {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      <div
        className="prose prose-green max-w-none mb-4 text-gray-900"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.attachmentFileName && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Attachment:</p>
              <p className="text-sm text-green-600">{post.attachmentOriginalName}</p>
            </div>
            {onDownloadFile && (
              <Button onClick={() => onDownloadFile(post)} size="sm">
                Download
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
