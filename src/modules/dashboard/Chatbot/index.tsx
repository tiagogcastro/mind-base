'use client'
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FiArrowUp } from 'react-icons/fi';

export default function Chatbot() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl rounded-xl p-2 bg-gray-700 border border-gray-600">
      <div className="flex items-end p-2 gap-2">
        <Textarea
          placeholder="Digite sua mensagem..."
          className="rounded-lg flex-1 p-2 border-none outline-0 resize-y text-gray-100 placeholder:text-gray-100 max-h-32 min-h-12"
        />
        <Button
          className="bg-white text-gray-800 p-2 text-lg rounded-full"
        >
          <FiArrowUp />
        </Button>
      </div>
    </div>
  )
}
