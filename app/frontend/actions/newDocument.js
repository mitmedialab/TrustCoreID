export const SELECT_DOCUMENT = 'SELECT_DOCUMENT';

export function select(item) {
  return {
    type: SELECT_DOCUMENT,
    payload: item
  };
}