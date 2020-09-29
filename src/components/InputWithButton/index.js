import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import { useField } from '@unform/core';

import {
  InputContainer,
  TextInput,
  ButtonContainer,
  ButtonText
} from './styles';

const InputWithButton = (
  { name, buttonText, containerStyle = {}, onPress, ...rest },
  ref
) => {
  const inputElementRef = useRef(null);
  const { registerField, defaultValue, fieldName } = useField(name);
  const inputValueRef = useRef({ value: defaultValue });

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    }
  }));

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      }
    });
  }, [fieldName, registerField]);

  return (
    <InputContainer style={containerStyle}>
      <TextInput
        ref={inputElementRef}
        placeholderTextColor="#777"
        defaultValue={defaultValue}
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
      <ButtonContainer onPress={onPress}>
        <ButtonText>{buttonText}</ButtonText>
      </ButtonContainer>
    </InputContainer>
  );
};

export default forwardRef(InputWithButton);
