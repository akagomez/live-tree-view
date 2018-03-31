import React from 'react';

import { Plus as PlusIcon } from 'react-feather';

import './style.css';

export default ({
  createFactoryFormIsVisible,
  onPromptCreateFactoryForm
}) => (
  <div className="tree">

    <ul>
      <li>
        <span className="node-name">
          Tree Root
        </span>

        {' '}

        <button
          className="button-feather-icon button-outline"
          onClick={onPromptCreateFactoryForm}
        >
          <PlusIcon />
        </button>

        {createFactoryFormIsVisible &&
          <div className="row">
            <div className="column column-50">
              <h5>
                Create Factory Node
              </h5>
              <form>
                <label htmlFor="factoryName">Name</label>
                <input type="text" placeholder="Factory Name" id="factoryName" />
              </form>
            </div>
          </div>
        }

        <ul>
          <li>
            <span className="node-name">
              Factory Node
            </span>

            <ul>
              <li>
                <span className="node-name">
                  Child Number
                </span>
              </li>
            </ul>

          </li>
        </ul>

      </li>
    </ul>
  </div>
);
