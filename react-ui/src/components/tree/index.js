import React from 'react';

import CreateFactoryForm from '../create-factory-form/'

import { Plus as PlusIcon } from 'react-feather';

import './style.css';

export default ({
  createFactoryFormIsVisible,
  onPromptCreateFactoryForm,
  onUpdateCreateFactoryField,
  onCancelCreateFactoryForm,
  onSubmitCreateFactoryForm
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
          disabled={createFactoryFormIsVisible}
        >
          <PlusIcon />
        </button>

        {createFactoryFormIsVisible &&
          <CreateFactoryForm
            onUpdateField={onUpdateCreateFactoryField}
            onCancelForm={onCancelCreateFactoryForm}
            onSubmitForm={onSubmitCreateFactoryForm} />
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
