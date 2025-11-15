// src/hooks/useNotes.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  fetchNotes,
  type FetchNotesParams,
  type FetchNotesResponse,
} from '../services/noteService';

export const NOTES_KEY = 'notes' as const;

export function useNotes(params: FetchNotesParams) {
  const query = useQuery<FetchNotesResponse>({
    queryKey: [NOTES_KEY, params],
    queryFn: () => fetchNotes(params),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    // удобные поля, чтобы не лазить в query.data в каждом компоненте
    notes: query.data?.notes ?? [],
    totalPages: query.data?.totalPages ?? 0,
  };
}
