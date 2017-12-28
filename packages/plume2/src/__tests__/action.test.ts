import actionType from '../action-type';

it('test arguments', () => {
  const Actions = actionType('ADD_TODO', 'DELETE_TODO');
  expect(Actions).toEqual({
    ADD_TODO: 'ADD_TODO',
    DELETE_TODO: 'DELETE_TODO'
  });
});

it('test object arguments', () => {
  const Actions = actionType({
    PDF: 'application/pdf',
    Text: 'text/plain',
    JPEG: 'image/jpeg'
  });

  expect(Actions).toEqual({
    PDF: 'application/pdf',
    Text: 'text/plain',
    JPEG: 'image/jpeg'
  });
});
