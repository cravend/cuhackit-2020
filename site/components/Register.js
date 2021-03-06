import styles from './Register.module.scss'
import fetch from 'isomorphic-unfetch'
import axios from 'axios'

import { Formik, Form, Field, ErrorMessage } from 'formik'

const Error = ({ children }) => (
  <div className={styles.required}>{children}</div>
)

const Checkbox = ({ name, type, message, value }) => (
  <div className={styles.dateButton}>
    <Field
      type={type}
      name={name}
      id={value ? value : name}
      value={value ? value : undefined}
    />
    <label htmlFor={value ? value : name}>{message}</label>
  </div>
)

const Element = ({ name, type, message, value, placeholder }) => (
  <div className={styles.element}>
    <label htmlFor={value ? value : name} className={styles.elementLabel}>
      {message}
    </label>
    <Field
      className={styles.fieldStyle}
      type={type}
      name={name}
      id={value ? value : name}
      placeholder={placeholder}
      value={value ? value : undefined}
    />
  </div>
)

const Basic = () => (
  <div className={styles.container}>
    <h2>Add a New Prescription</h2>
    <p className={styles.note}>All fields are required</p>
    <Formik
      initialValues={{
        medicine: '',
        days: undefined,
        time: ''
      }}
      validate={values => {
        //[0-9][0-9]:[0-9][0-9]
        const errors = {}
        if (!values.medicine) {
          errors.medicine = 'Name of medicine is required.'
        }
        if (values.days == undefined) {
          errors.days = 'Please choose at least one day to schedule.'
        }
        if (!/^[0-2]?[0-9]:[0-6][0-9]$/.test(values.time)) {
          errors.time = 'Please enter a valid time.'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        var authOptions = {
          method: 'POST',
          url: 'http://localhost:5000/add-schedule',
          data: JSON.stringify(values, null, 2),
          headers: {
            'Content-Type': 'application/json'
          },
          json: true
        }

        axios(authOptions)
          .post(
            'http://localhost:5000/add-schedule',
            JSON.stringify(values, null, 2)
          )
          .then(res => {
            console.log(res)
            console.log(res.data)
            location.reload()
          })
          .catch(function(error) {
            location.reload()
            console.log(error)
          })
        alert('end submission')

        resetForm()
        setSubmitting(false)
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <ErrorMessage name="medicine" component={Error} />
          <ErrorMessage name="days" component={Error} />
          <ErrorMessage name="time" component={Error} />

          <div className={styles.flexContainer}>
            <Element
              name="medicine"
              type="text"
              message="Enter the name of medicine to add:"
              placeholder="Medicine Name"
            />

            <Element
              name="time"
              type="time"
              message="Enter time for reminder (00:00):"
              placeholder="13:00"
            />
          </div>
          <br />
          <p className={styles.elementLabel}>
            Select days to receive reminders:
          </p>
          <div className={styles.flexContainer}>
            <Checkbox name="days" type="checkbox" message="S" value="U" />
            <Checkbox name="days" type="checkbox" message="M" value="M" />
            <Checkbox name="days" type="checkbox" message="T" value="T" />
            <Checkbox name="days" type="checkbox" message="W" value="W" />
            <Checkbox name="days" type="checkbox" message="T" value="R" />
            <Checkbox name="days" type="checkbox" message="F" value="F" />
            <Checkbox name="days" type="checkbox" message="S" value="S" />
          </div>
          <br />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
)

export default Basic
