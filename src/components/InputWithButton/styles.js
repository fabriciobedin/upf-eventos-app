import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { RectButton } from 'react-native-gesture-handler';

export const InputContainer = styled.View`
  width: 100%;
  height: 60px;

  background: #fff;
  border-radius: 10px;
  flex: 1;

  flex-direction: row;
  align-items: center;

  border-width: 2px;
  border-color: #ed6707;
`;

export const TextInput = styled.TextInput`
  flex: 0.7;
  color: #777;
  font-size: 16px;
  padding-left: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;

export const ButtonContainer = styled(RectButton)`
  flex: 0.3;

  height: 60px;
  background: #ed6707;
  border-radius: 10px;

  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #eee;
  font-size: 17px;
  font-family: 'RobotoSlab-Medium';
`;
