'use client'

import { HiOutlineChip } from 'react-icons/hi'

export function MindbaseLogo() {
  return (
    <div className="flex items-center gap-2">
      <HiOutlineChip className="text-2xl text-purple-600 animate-spin drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent tracking-wider animate-pulse-bright">
        mindbase
      </span>
    </div>
  )
}