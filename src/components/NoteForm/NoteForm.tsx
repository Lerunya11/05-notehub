import { Formik, Form, Field, ErrorMessage as FormikError } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type CreateNotePayload } from '../../services/noteService';
import { NOTES_KEY } from '../../hooks/useNotes';
import css from './NoteForm.module.css';

export interface NoteFormProps {
  onCancel: () => void;
}

const Schema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500).default(''),
  tag: Yup.mixed<CreateNotePayload['tag']>().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']).required(),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      onCancel();
    },
  });

  return (
    <Formik<CreateNotePayload>
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      validationSchema={Schema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ isValid, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <span className={css.error}><FormikError name="title" /></span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <span className={css.error}><FormikError name="content" /></span>
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
            <span className={css.error}><FormikError name="tag" /></span>
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>Cancel</button>
            <button type="submit" className={css.submitButton} disabled={!isValid || isSubmitting || mutation.isPending}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
