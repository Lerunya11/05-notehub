// src/hooks/useNotes.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchNotes,
  createNote as apiCreateNote,
  deleteNote as apiDeleteNote,
  type CreateNotePayload,
} from '../services/noteService';
import type { Note } from '../types/note';

export interface UseNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface UseNotesResult {
  notes: Note[];
  totalPages: number;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  createNote: (payload: CreateNotePayload) => Promise<Note>;
  deleteNote: (id: string) => Promise<Note>;
}

export function useNotes({ page, perPage, search }: UseNotesParams): UseNotesResult {
  const qc = useQueryClient();

  const queryKey = ['notes', { page, perPage, search: search ?? '' }];

  const {
    data,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage, search }),
    keepPreviousData: true,
  });

  // Нормализуем возможные формы ответа API
  const notes = (data as any)?.results ?? (data as any)?.notes ?? [];
  const totalPages = (data as any)?.totalPages ?? 1;

  const createMutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => apiCreateNote(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDeleteNote(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  return {
    notes,
    totalPages,
    isFetching,
    isError,
    error,
    // важные поля явно присутствуют
    createNote: createMutation.mutateAsync,
    deleteNote: deleteMutation.mutateAsync,
  };
}
