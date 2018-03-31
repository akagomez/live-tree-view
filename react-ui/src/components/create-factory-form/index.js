import React from 'react';

import './style.css';

export default () => (
  <form className="create-factory-form">
    <fieldset>
      <p>
        Create a factory node.
      </p>

      <div className="form-fields">
        <div className="form-field">
          <label htmlFor="factoryName">Name:</label>
          <input type="text" placeholder="Factory Name" id="factoryName" />
        </div>

        <div className="form-field">
          <label htmlFor="numberOfChildren">Number of Children:</label>
          <input type="number" min="1" max="15" placeholder="1-5" id="numberOfChildren" />
        </div>

        <div className="form-field">
          <label htmlFor="lowerBound">Range Start:</label>
          <input type="number" min="1" placeholder="100" id="lowerBound" />
        </div>

        <div className="form-field">
          <label htmlFor="upperBound">Range End:</label>
          <input type="number" min="1" placeholder="999" id="upperBound" />
        </div>
      </div>

    </fieldset>
  </form>
);