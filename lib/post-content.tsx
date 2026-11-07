import Link from "next/link"
import type { ReactNode } from "react"

const TOKEN_PATTERN = /(^|[\s([{/-])([@#][a-zA-Z0-9_]+)/g

export function formatPostContent(text: string): ReactNode {
    const parts: ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    let key = 0

    while ((match = TOKEN_PATTERN.exec(text)) !== null) {
        const tokenStart = match.index + match[1].length
        parts.push(text.slice(lastIndex, tokenStart))

        const token = match[2]
        if (token.startsWith("@")) {
            parts.push(
                <Link
                    key={`${token}-${key++}`}
                    href={`/profile/${encodeURIComponent(token.slice(1))}`}
                    className="text-blue-500 hover:underline"
                >
                    {token}
                </Link>
            )
        } else {
            parts.push(
                <Link
                    key={`${token}-${key++}`}
                    href={`/search?q=${encodeURIComponent(token)}`}
                    className="text-blue-500 hover:underline"
                >
                    {token}
                </Link>
            )
        }

        lastIndex = tokenStart + token.length
    }

    parts.push(text.slice(lastIndex))
    return parts
}
