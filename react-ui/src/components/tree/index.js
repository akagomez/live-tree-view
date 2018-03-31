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
        Tree Root

        {' '}

        <button
          className="button-feather-icon button-outline"
          onClick={onPromptCreateFactoryForm}
        >
          <PlusIcon />
        </button>

        {createFactoryFormIsVisible &&
          <div class="row">
            <div class="column column-50">
              <h5>
                Create Factory Node
              </h5>
              <form action="javascript: void(0)">
                <label htmlFor="factoryName">Name</label>
                <input type="text" placeholder="Factory Name" id="factoryName" />
              </form>
            </div>
          </div>
        }

        <ul>
          <li>
            Factory Node

            <ul>
              <li>
                Child Number
              </li>
            </ul>

          </li>
        </ul>

      </li>
    </ul>
  </div>
);
