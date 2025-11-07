
import axios from 'axios';
import type { Note } from '../types/note';

const token = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;

if (!token) {
  if (import.meta.env.DEV) {
    throw new Error('Missing VITE_NOTEHUB_TOKEN env variable');
  } else {
    console.error('VITE_NOTEHUB_TOKEN is missing at build time');
  }
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : { 'Content-Type': 'application/json' },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
