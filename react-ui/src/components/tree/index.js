import React from 'react';

import CreateFactoryForm from '../create-factory-form/'

import {
  Plus as PlusIcon,
  Trash as TrashIcon
} from 'react-feather';

import './style.css';

export default ({
  children,
  createFactoryFormErrors,
  createFactoryFormIsVisible,
  onPromptCreateFactoryForm,
  onUpdateCreateFactoryField,
  onCancelCreateFactoryForm,
  onSubmitCreateFactoryForm,
  onDestroyChild
}) => (
  <div className="tree">

    <ul>
      <li>
        <span className="node-name">
          Tree Root
        </span>

        {' '}

        <button
          className="button-feather-icon button-clear"
          onClick={onPromptCreateFactoryForm}
          disabled={createFactoryFormIsVisible}
        >
          <PlusIcon size="20" />
        </button>

        {createFactoryFormIsVisible &&
          <CreateFactoryForm
            errors={createFactoryFormErrors}
            onUpdateField={onUpdateCreateFactoryField}
            onCancelForm={onCancelCreateFactoryForm}
            onSubmitForm={onSubmitCreateFactoryForm} />
        }

        <ul>
          {children && children.map((child) => (
            <li key={child._id}>
              <span className="node-name">
                {child.name} ({child.lowerBound}-{child.upperBound})
              </span>

              {' '}

              <button
                className="button-feather-icon button-clear"
                onClick={() => {
                  onDestroyChild(child)
                }}
              >
                <TrashIcon size="20" />
              </button>

              <ul>
                {[...Array(child.numberOfChildren).keys()].map((val, i) => (
                  <li key={i}>
                    <span className="node-name">
                      Child {i}
                    </span>
                  </li>
                ))}
              </ul>

            </li>
          ))}
        </ul>

      </li>
    </ul>
  </div>
);
