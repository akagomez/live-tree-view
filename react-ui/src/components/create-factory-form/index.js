import React from 'react';

import './style.css';

export default ({
  onUpdateCreateFactoryField,
  onCancelFactoryCreate,
  onSubmitFactoryCreate
}) => {

  const onChangeFieldValue = (ev) => {
    console.log(ev.currentTarget.id, ev.currentTarget.value)
    onUpdateCreateFactoryField(
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
            href="#"
            className="button-clear"
            onClick={(ev) => {
              ev.preventDefault()
              onCancelFactoryCreate()
            }}
          >
            Cancel
          </button>

          {' '}

          <button
            onClick={onSubmitFactoryCreate}
          >
            Create Factory Node
          </button>
        </div>

      </fieldset>
    </form>
  )
};