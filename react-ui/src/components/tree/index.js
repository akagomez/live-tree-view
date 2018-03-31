import React from 'react';
import './style.css';

export default () => (
  <div className="tree">
    <ul>
      <li>
        Tree Root

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
