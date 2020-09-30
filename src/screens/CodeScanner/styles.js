import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Form } from '@unform/mobile';

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: getBottomSpace()
  }
})``;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 18px;
  font-family: 'RobotoSlab-Medium';
  line-height: 28px;
  align-self: center;
  margin-left: 20px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const InfoTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  padding: 16px;
  color: #555;
  align-self: center;
`;

export const FormContainer = styled(Form)`
  width: 100%;
  flex-direction: row;
  flex: 1;
  padding: 0 16px;
  align-items: center;
`;
