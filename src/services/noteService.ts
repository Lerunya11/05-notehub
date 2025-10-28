// src/services/noteService.ts
import axios from 'axios';
import type { Note } from '../types/note';

const token = import.meta.env.VITE_NOTEHUB_TOKEN;
if (!token) {
  // чтобы быстро поймать ошибку локально / на Vercel
  // eslint-disable-next-line no-throw-literal
  throw new Error('Missing VITE_NOTEHUB_TOKEN env variable');
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  results: Note[]; // <- ТАК ДОЛЖНО БЫТЬ
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
