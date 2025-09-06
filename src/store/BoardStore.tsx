import { create } from 'zustand';

type Board = {
  id: string;
  name: string;
};

type BoardState = {
  boards: Board[];
  selectedBoard: Board | null;
  setBoards: (boards: Board[]) => void;
  selectBoard: (board: Board) => void;
};

export const useBoardStore = create<BoardState>((set) => {
  const initialBoards: Board[] = [
    {
      id: 'board-1-id-usuario',
      name: 'board-1-id-usuario'
    },
    {
      id: 'board-2-id-usuario',
      name: 'board-2-id-usuario'
    }
  ];

  return {
    boards: initialBoards,
    selectedBoard: initialBoards[0] || null,
    setBoards: (boards) => set({ boards }),
    selectBoard: (board) => set({ selectedBoard: board }),
  };
});
