import React from 'react';

import { TextContainer } from './styles';

const TextTitle = ({ children }) => (
  <TextContainer>
    {'< < < '} {children} {' > > >'}
  </TextContainer>
);

export default TextTitle;
