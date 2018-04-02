import React from 'react';

import { view } from 'react-easy-state'

import FactoryForm from '../factory-form/'

import {
  Plus as PlusIcon,
  Trash as TrashIcon,
  Edit as EditIcon
} from 'react-feather';

import './style.css';

export default view(({
  children,
  createFactoryFormIsVisible,
  onPromptCreateFactoryForm,
  onCancelCreateFactoryForm,
  onSubmitCreateFactoryForm,
  onDestroyChild,
  onPromptChildEditForm,
  onCancelChildEditForm,
  onSubmitChildEditForm
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
          <FactoryForm
            onCancelForm={onCancelCreateFactoryForm}
            onSubmitForm={onSubmitCreateFactoryForm}
            description="Create a new factory node."
            submitButtonText="Create Factory" />
        }

        <ul>
          {children && children.map((child) => (
            <li key={child._id}>
              <span className="node-name">
                {child.name} Factory
                {' '}
                <code>[{child.lowerBound}...{child.upperBound}]</code>
              </span>

              {' '}

              <button
                className="button-feather-icon button-clear"
                disabled={child.isEditing}
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
                <FactoryForm
                  defaultValues={{
                    name: child.name,
                    numberOfChildren: child.numberOfChildren,
                    lowerBound: child.lowerBound,
                    upperBound: child.upperBound
                  }}
                  onCancelForm={() => {
                    onCancelChildEditForm(child)
                  }}
                  onSubmitForm={async (fields) => {
                    await onSubmitChildEditForm(child, fields)
                  }}
                  description={`Update the "${child.name}" factory node.`}
                  submitButtonText="Update Factory" />
              }

              <ul>
                {child.numbers.map((number, i) => (
                  <li key={i}>
                    <span className="node-name">
                      Child {number}
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
