// src/components/NoteForm/NoteForm.tsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import { useNotes } from '../../hooks/useNotes';
import type { NoteTag } from '../../types/note';

interface Props {
  onClose: () => void;
}

const schema = Yup.object({
  title:   Yup.string().min(3).max(50).required('Required'),
  content: Yup.string().max(500),
  tag:     Yup.mixed<NoteTag>()
            .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
            .required('Required'),
});

const initialValues = {
  title: '',
  content: '',
  tag: 'Todo' as NoteTag,
};

export default function NoteForm({ onClose }: Props) {
  // используем хук для доступа к createNote
  const { createNote, isCreating } = useNotes({ page: 1, perPage: 1 });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await createNote(values);
          resetForm();
          onClose();
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
              disabled={isSubmitting || isCreating}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || isCreating}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
