import React from 'react';

import { Plus as PlusIcon } from 'react-feather';

import './style.css';


export default () => (
  <div className="tree">
    <ul>
      <li>
        Tree Root

        {' '}

        <button className="button-feather-icon button-outline">
          <PlusIcon />
        </button>

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
