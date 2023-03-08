import { Field, FieldAttributes, Form, Formik, FormikProps } from 'formik';
import React from 'react';

export type IFormProps = {};

const MyInput = ({ field, form, ...props }: FieldAttributes<any>) => {
  return <input {...field} {...props} />;
};

const ExamForm: React.FC<IFormProps> = ({}) => {
  return (
    <div>
      <Formik
        initialValues={{ email: '', color: 'red', firstName: '', lastName: '' }}
        onSubmit={(values, actions) => {}}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <Field type="email" name="email" placeholder="Email" />
            <Field as="select" name="color">
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
            </Field>

            <Field name="lastName">
              {({
                field, // { name, value, onChange, onBlur }
                form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                meta,
              }: FieldAttributes<any>) => (
                <div>
                  <input type="text" placeholder="Email" {...field} />
                  {meta.touched && meta.error && (
                    <div className="error">{meta.error}</div>
                  )}
                </div>
              )}
            </Field>
            <Field name="lastName" placeholder="Doe" component={MyInput} />
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ExamForm;
