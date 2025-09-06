'use client'

import { useGetBoardSchema } from '@/data/board/schema'
import { useBoardStore } from '@/store/BoardStore'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function BoardSync() {
  const params = useParams()
  const router = useRouter()
  const boardId = params.boardId as string;

  const { boards, selectBoardById } = useBoardStore()
  useGetBoardSchema(boardId)

  useEffect(() => {
    if (boardId && boards.length > 0) {
      const board = selectBoardById(boardId)

      if (!board) {
        console.warn(`Board ${boardId} não encontrado`)
        router.push('/dashboard')
      }
    }
  }, [boardId, boards, selectBoardById, router])

  return null
}
