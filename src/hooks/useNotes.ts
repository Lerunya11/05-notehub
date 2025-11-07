import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes, type FetchNotesParams, type FetchNotesResponse } from '../services/noteService';

export const NOTES_KEY = 'notes' as const;

export function useNotes(params: FetchNotesParams) {
  const query = useQuery<FetchNotesResponse>({
    queryKey: [NOTES_KEY, { page: params.page, perPage: params.perPage, search: params.search ?? '' }],
    queryFn: () => fetchNotes(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  return {
    ...query,
    notes: query.data?.notes ?? [],
    totalPages: query.data?.totalPages ?? 0,
  };
}
