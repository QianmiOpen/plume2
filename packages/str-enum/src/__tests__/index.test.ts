import StrEnum from '../index';

it('test arguments', () => {
  const Actions = StrEnum('ADD_TODO', 'DELETE_TODO');
  expect(Actions).toEqual({
    ADD_TODO: 'ADD_TODO',
    DELETE_TODO: 'DELETE_TODO'
  });
});

it('test object arguments', () => {
  const Actions = StrEnum({
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
