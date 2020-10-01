import React, { useState, useCallback } from 'react';

import {
  ToggleContainer,
  ButtonContainerInput,
  ButtonContainerOutput,
  ButtonTextIn,
  ButtonTextOut
} from './styles';

const ToggleButton = ({ children, type, status, ...rest }) => {
  const [buttonType, setButtonType] = useState(type);
  const [opt1, opt2] = children.split('|');

  const changeButtonTypeToIn = useCallback(() => {
    setButtonType('in');
    status('in');
  }, []);

  const changeButtonTypeToOut = useCallback(() => {
    setButtonType('out');
    status('out');
  }, []);

  return (
    <ToggleContainer>
      <ButtonContainerInput
        buttonType={buttonType}
        {...rest}
        activeOpacity={0.9}
        onPress={changeButtonTypeToIn}>
        <ButtonTextIn buttonType={buttonType}>{opt1}</ButtonTextIn>
      </ButtonContainerInput>

      <ButtonContainerOutput
        buttonType={buttonType}
        {...rest}
        activeOpacity={0.9}
        onPress={changeButtonTypeToOut}>
        <ButtonTextOut buttonType={buttonType}>{opt2}</ButtonTextOut>
      </ButtonContainerOutput>
    </ToggleContainer>
  );
};

export default ToggleButton;
