"use client"

import MyCard from "@/components/myComponents/MyCard"
import QuickPost from "@/components/myComponents/QuickPost"
import { fetchFeedPosts, type Post } from "@/lib/posts"
import { useCallback, useEffect, useState } from "react"

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadPosts = useCallback(async () => {
    setLoading(true)

    const result = await fetchFeedPosts()
    setPosts(result.posts)
    setError(result.error ?? "")
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  return (
    <>
      <div className="flex flex-col p-3 gap-3">
        <QuickPost onPostCreated={() => void loadPosts()} />
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="text-destructive">{error}</p>
            <button
              type="button"
              onClick={() => void loadPosts()}
              className="mt-3 text-xs font-medium underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        ) : null}
        <div className="flex flex-col">
          {loading && posts.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Loading posts...</p>
          ) : null}
          {!loading && posts.length === 0 && !error ? (
            <p className="p-4 text-sm text-muted-foreground">No posts yet. Share the first update.</p>
          ) : null}
          {posts.map((post) => (
            <MyCard key={post.id} post={post} onPostChanged={() => void loadPosts()} />
          ))}
        </div>
      </div>
    </>
  )
}
