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

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  selectedBoard: null,
  setBoards: (boards) => set({ boards }),
  selectBoard: (board) => set({ selectedBoard: board }),
}));
