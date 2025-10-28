// src/hooks/useNotes.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  fetchNotes,
  createNote,
  deleteNote,
  type FetchNotesParams,
  type CreateNotePayload,
  type FetchNotesResponse,
} from '../services/noteService';

export const NOTES_KEY = 'notes' as const;

export function useNotes(params: FetchNotesParams) {
  const queryClient = useQueryClient();

  // --- READ ---
  const notesQuery = useQuery<FetchNotesResponse>({
    queryKey: [NOTES_KEY, params],
    queryFn: () => fetchNotes(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  // --- CREATE ---
  const create = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_KEY] });
    },
  });

  // --- DELETE ---
  const del = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_KEY] });
    },
  });

  return {
    // исходный объект запроса (статусы/ошибка и т.п.)
    ...notesQuery,

    // нормализованные значения — пользоваться ИМИ в компонентах
    notes: notesQuery.data?.results ?? [],
    totalPages: notesQuery.data?.totalPages ?? 0,
    totalItems: notesQuery.data?.totalItems ?? 0,
    page: notesQuery.data?.page ?? params.page,
    perPage: notesQuery.data?.perPage ?? params.perPage,

    // мутации
    createNote: create.mutateAsync,
    isCreating: create.isPending,

    deleteNote: del.mutateAsync,
    isDeleting: del.isPending,
  };
}
