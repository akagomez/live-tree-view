import React from 'react';

import './style.css';

export default ({
  errors,
  onUpdateField,
  onCancelForm,
  onSubmitForm
}) => {

  const onChangeFieldValue = (ev) => {
    console.log(ev.currentTarget.id, ev.currentTarget.value)
    onUpdateField(
      ev.currentTarget.id,
      ev.currentTarget.value
    )
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
        {errors && errors.length > 0 &&
          <div className="errors">
            <span>Submission Errors:</span>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        }

        <p>
          Create a factory node.
        </p>

        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              placeholder="Factory Name"
              id="name"
              onChange={onChangeFieldValue} />
          </div>

          <div className="form-field">
            <label htmlFor="numberOfChildren">Number of Children:</label>
            <input
              type="number"
              min="1"
              max="15"
              placeholder="1-15"
              id="numberOfChildren"
              onChange={onChangeFieldValue} />
          </div>

          <div className="form-field">
            <label htmlFor="lowerBound">Lower Bound:</label>
            <input
              type="number"
              min="1"
              placeholder="100"
              id="lowerBound"
              onChange={onChangeFieldValue} />
          </div>

          <div className="form-field">
            <label htmlFor="upperBound">Upper Bound:</label>
            <input
              type="number"
              min="1"
              placeholder="999"
              id="upperBound"
              onChange={onChangeFieldValue} />
          </div>
        </div>

        <div className="actions">
          <button
            type="button"
            className="button-clear"
            onClick={(ev) => {
              ev.preventDefault()
              onCancelForm()
            }}
          >
            Cancel
          </button>

          {' '}

          <button
            type="submit"
            onClick={onSubmitForm}
          >
            Create Factory Node
          </button>
        </div>

      </fieldset>
    </form>
  )
};