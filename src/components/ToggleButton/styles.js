import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const ToggleContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const ButtonContainerInput = styled.TouchableOpacity`
  flex: 0.5;
  background: ${props => (props.buttonType === 'in' ? '#ed6707' : '#ddd')};
  border-bottom-left-radius: 25px;
  border-top-left-radius: 25px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const ButtonContainerOutput = styled.TouchableOpacity`
  flex: 0.5;
  background: ${props => (props.buttonType === 'out' ? '#ed6707' : '#ddd')};
  border-bottom-right-radius: 25px;
  border-top-right-radius: 25px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const ButtonTextIn = styled.Text`
  color: ${props => (props.buttonType === 'in' ? '#eee' : '#aaa')};
  font-size: 17px;
  font-family: 'RobotoSlab-Medium';
`;

export const ButtonTextOut = styled.Text`
  color: ${props => (props.buttonType === 'out' ? '#eee' : '#aaa')};
  font-size: 17px;
  font-family: 'RobotoSlab-Medium';
`;
