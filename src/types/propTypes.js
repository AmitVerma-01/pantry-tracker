import PropTypes from 'prop-types';

export const itemShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  userId: PropTypes.string,
  email: PropTypes.string,
  createdAt: PropTypes.object,
  updatedAt: PropTypes.object
});

export const recipeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  userId: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  ingredientsHash: PropTypes.string,
  recipeHtml: PropTypes.string,
  createdAt: PropTypes.object,
  lastAccessedAt: PropTypes.object
});

export const userShape = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  email: PropTypes.string,
  displayName: PropTypes.string
});

export const childrenProp = PropTypes.node;

export const callbackProp = PropTypes.func;

export const optionalString = PropTypes.string;

export const optionalBool = PropTypes.bool;
