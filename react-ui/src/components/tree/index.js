import React from 'react';

import { view } from 'react-easy-state'

import CreateFactoryForm from '../create-factory-form/'

import {
  Plus as PlusIcon,
  Trash as TrashIcon,
  Edit as EditIcon
} from 'react-feather';

import './style.css';

export default view(({
  children,
  createFactoryFormErrors,
  createFactoryFormIsVisible,
  onPromptCreateFactoryForm,
  onUpdateCreateFactoryField,
  onCancelCreateFactoryForm,
  onSubmitCreateFactoryForm,
  onDestroyChild,
  onPromptChildEditForm,
  onCancelChildEditForm,
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
                  onPromptChildEditForm(child)
                }}
              >
                <EditIcon size="20" />
              </button>

              {' '}

              <button
                className="button-feather-icon button-clear"
                onClick={() => {
                  onDestroyChild(child)
                }}
              >
                <TrashIcon size="20" />
              </button>

              {child.isEditing &&
                <CreateFactoryForm
                  // errors={createFactoryFormErrors}
                  // onUpdateField={onUpdateCreateFactoryField}
                  onCancelForm={() => {
                    onCancelChildEditForm(child)
                  }}
                  /*onSubmitForm={onSubmitCreateFactoryForm}*/ />
              }

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
));
