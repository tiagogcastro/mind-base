import { create } from 'zustand';

export type Board = { id: string; name: string };

export type BoardState = {
  boards: Board[];
  selectedBoard: Board | null;
  setBoards: (boards: Board[]) => void;
  selectBoard: (board: Board) => void;
  selectBoardById: (boardId: string) => Board | null;
};

export const useBoardStore = create<BoardState>((set, get) => {
  const initialBoards: Board[] = [
    { id: 'board-1-id-usuario', name: 'board-1-id-usuario' },
    { id: 'board-2-id-usuario', name: 'board-2-id-usuario' },
  ];

  const defaultBoard = initialBoards.length > 0 ? initialBoards[0] : null;

  return {
    boards: initialBoards,
    selectedBoard: defaultBoard,
    setBoards: (boards) => {
      const current = get().selectedBoard;
      const stillExists = current && boards.some(b => b.id === current.id);
      const selectedBoard = stillExists ? current : boards.length > 0 ? boards[0] : null

      set({
        boards,
        selectedBoard,
      });
    },
    selectBoard: (board) => set({ selectedBoard: board }),
    selectBoardById: (boardId: string) => {
      const { boards } = get();
      const board = boards.find((board) => board.id === boardId);

      if (board) {
        set({ selectedBoard: board });
        return board;
      }

      return null;
    },
  };
});
