import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('aws-amplify', () => ({
  API: { graphql: jest.fn() },
  Storage: { get: jest.fn(), put: jest.fn(), remove: jest.fn() },
}));

jest.mock('@aws-amplify/ui-react', () => {
  const React = require('react');
  return {
    Button: (props) => <button {...props} />,
    Flex: (props) => <div {...props} />,
    Heading: ({ level, children }) => React.createElement(`h${level}`, null, children),
    Image: (props) => <img {...props} />,
    Text: (props) => <span {...props} />,
    TextField: (props) => <input {...props} />,
    View: (props) => <div {...props} />,
    withAuthenticator: (Component) => (props) => <Component {...props} />,
  };
});

test('renders image with note name in alt text', async () => {
  const { API, Storage } = require('aws-amplify');
  API.graphql.mockResolvedValue({
    data: { listNotes: { items: [{ id: '1', name: 'Test note', description: 'Desc', image: 'file.jpg' }] } },
  });
  Storage.get.mockResolvedValue('https://example.com/file.jpg');

  render(<App signOut={() => {}} />);

  const img = await screen.findByRole('img', { name: /visual aid for test note/i });
  expect(img).toHaveAttribute('src', 'https://example.com/file.jpg');
});
