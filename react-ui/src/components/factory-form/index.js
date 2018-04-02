import React, { Component } from 'react'

import { store, view } from 'react-easy-state'

import './style.css';

class FactoryForm extends Component {
  form = store({
    errors: [],
    inputs: {}
  })

  render () {
    const form = this.form
    const {
      description,
      onCancelForm,
      onSubmitForm,
      submitButtonText,
      defaultValues
    } = this.props

    const onChangeFieldValue = (ev) => {
      form.inputs[ev.currentTarget.id] =
        ev.currentTarget.value
    }

    return (
      <form
        className="create-factory-form"
        onSubmit={(ev) => {
          ev.preventDefault();
          return false;
        }}
      >
        <fieldset>
          {form.errors && form.errors.length > 0 &&
            <div className="errors">
              <span>Submission Errors:</span>
              <ul>
                {form.errors.map((error, index) => (
                  <li key={index}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          }

          <p>
            {description}
          </p>

          <div className="form-fields">
            <div className="form-field">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                placeholder="Factory Name"
                id="name"
                defaultValue={defaultValues.name}
                onChange={onChangeFieldValue} />
            </div>

            <div className="form-field">
              <label htmlFor="numberOfChildren">Number of Children:</label>
              <input
                type="number"
                pattern="\d*"
                min="1"
                max="15"
                placeholder="1-15"
                id="numberOfChildren"
                defaultValue={defaultValues.numberOfChildren}
                onChange={onChangeFieldValue} />
            </div>

            <div className="form-field">
              <label htmlFor="lowerBound">Lower Bound:</label>
              <input
                type="number"
                pattern="\d*"
                min="1"
                placeholder="100"
                id="lowerBound"
                defaultValue={defaultValues.lowerBound}
                onChange={onChangeFieldValue} />
            </div>

            <div className="form-field">
              <label htmlFor="upperBound">Upper Bound:</label>
              <input
                type="number"
                pattern="\d*"
                min="1"
                placeholder="999"
                id="upperBound"
                defaultValue={defaultValues.upperBound}
                onChange={onChangeFieldValue} />
            </div>
          </div>

          <div className="actions">
            <button
              type="button"
              className="button-clear"
              onClick={(ev) => {
                ev.preventDefault()
                form.inputs = {}
                form.errors = []
                onCancelForm()
              }}
            >
              Cancel
            </button>

            {' '}

            <button
              type="submit"
              onClick={async () => {
                try {
                  await onSubmitForm(
                    Object.assign({}, defaultValues, form.inputs)
                  )
                } catch (err) {
                  form.errors = [err.response.data.message]
                }
              }}
            >
              {submitButtonText}
            </button>
          </div>

        </fieldset>
      </form>
    )
  }
}

FactoryForm.defaultProps = {
  defaultValues: {
    name: '',
    numberOfChildren: '',
    lowerBound: '',
    upperBound: ''
  }
}

export default view(FactoryForm)