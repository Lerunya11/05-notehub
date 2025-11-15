// src/components/NoteForm/NoteForm.tsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createNote,
  type CreateNotePayload,
} from '../../services/noteService';

import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
}

// ✅ схема валидации по ТЗ:
// - title: минимум 3 символа, обязательно
// - content: НЕобязательное поле
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .required('Title is required'),
  content: Yup.string()
    .trim()
    .optional(),
  tag: Yup.mixed<CreateNotePayload['tag']>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

const initialValues: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo',
};

const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  // ✅ Мутация создания заметки живёт ВНУТРИ формы
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: CreateNotePayload) => createNote(values),
    onSuccess: () => {
      // инвалидация списка заметок
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      // закрываем модалку
      onCancel();
    },
  });

  const handleSubmit = async (values: CreateNotePayload) => {
    await mutateAsync(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <label className={css.label}>
            Title
            <Field
              name="title"
              type="text"
              className={css.input}
              placeholder="Enter note title"
            />
            <ErrorMessage
              name="title"
              component="p"
              className={css.error}
            />
          </label>

          <label className={css.label}>
            Content
            <Field
              as="textarea"
              name="content"
              className={css.textarea}
              rows={4}
              placeholder="Enter note content (optional)"
            />
            <ErrorMessage
              name="content"
              component="p"
              className={css.error}
            />
          </label>

          <label className={css.label}>
            Tag
            <Field as="select" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage
              name="tag"
              component="p"
              className={css.error}
            />
          </label>

          <div className={css.buttons}>
            <button
              type="submit"
              disabled={isSubmitting || isPending}
            >
              {isPending ? 'Creating...' : 'Create note'}
            </button>

            <button
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
