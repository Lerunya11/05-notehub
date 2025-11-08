import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import type { CreateNotePayload } from '../../services/noteService';

// 🔹 Типизация пропсов
export interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (payload: CreateNotePayload) => void;
}

// 🔹 Схема валидации (Yup)
const noteSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too short!')
    .max(50, 'Too long!')
    .required('Title is required'),
  content: Yup.string()
    .min(5, 'Too short!')
    .max(500, 'Too long!')
    .required('Content is required'),
  tag: Yup.mixed<'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping'>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Select a tag'),
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

            <label className={css.label} htmlFor="title">
              Title
            </label>
            <Field
              className={css.input}
              id="title"
              name="title"
              placeholder="Enter title"
            />
            <ErrorMessage
              className={css.error}
              name="title"
              component="div"
            />

            <label className={css.label} htmlFor="content">
              Content
            </label>
            <Field
              className={css.textarea}
              as="textarea"
              id="content"
              name="content"
              placeholder="Write your note..."
            />
            <ErrorMessage
              className={css.error}
              name="content"
              component="div"
            />

            <label className={css.label} htmlFor="tag">
              Tag
            </label>
            <Field className={css.select} as="select" id="tag" name="tag">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage
              className={css.error}
              name="tag"
              component="div"
            />

            <div className={css.buttons}>
              <button
                className={css.cancel}
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className={css.submit}
                type="submit"
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
