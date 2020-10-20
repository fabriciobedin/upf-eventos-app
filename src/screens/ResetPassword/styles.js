import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { Form } from '@unform/mobile';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 80}px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #000;
  font-family: 'RobotoSlab-Medium';
  margin: 30px 0 30px;
`;

export const BackToSignIn = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #eee;
  border-top-width: 1px;
  border-color: #aaa;
  padding: 16px 0 ${16 + getBottomSpace() / 2}px;

  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const BackToSignInText = styled.Text`
  color: #777;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 15px;
`;

export const FormContainer = styled(Form)`
  width: 100%;
`;
