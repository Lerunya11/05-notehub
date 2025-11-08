import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import type { CreateNotePayload } from '../../services/noteService';

export interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (payload: CreateNotePayload) => Promise<void> | void;
}

const noteSchema = Yup.object().shape({
  title: Yup.string().min(2).max(50).required('Title is required'),
  content: Yup.string().min(5).max(500).required('Content is required'),
  tag: Yup.mixed<'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping'>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required(),
});

export default function NoteForm({ onCancel, onSubmit }: NoteFormProps) {
  const initialValues: CreateNotePayload = {
    title: '',
    content: '',
    tag: 'Todo',
  };

  const handleSubmit = (values: CreateNotePayload, { resetForm }: any) => {
    onSubmit(values);
    resetForm();
  };

  return (
    <div className={css.formContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={noteSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <h2 className={css.title}>Create a new note</h2>

            <label htmlFor="title" className={css.label}>
              Title
            </label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="div" className={css.error} />

            <label htmlFor="content" className={css.label}>
              Content
            </label>
            <Field
              as="textarea"
              id="content"
              name="content"
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="div"
              className={css.error}
            />

            <label htmlFor="tag" className={css.label}>
              Tag
            </label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />

            <div className={css.buttons}>
              <button
                type="button"
                className={css.cancel}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submit}
                disabled={isSubmitting}
              >
                Create
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
