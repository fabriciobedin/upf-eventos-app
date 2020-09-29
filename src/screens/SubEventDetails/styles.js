import styled from 'styled-components/native';
import {
  getStatusBarHeight,
  getBottomSpace
} from 'react-native-iphone-x-helper';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Form } from '@unform/mobile';

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: getBottomSpace()
  }
})``;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${getStatusBarHeight() + 24}px;
  background: #28262e;

  flex-direction: row;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: 'RobotoSlab-Medium';
  line-height: 28px;
  align-self: center;
  margin-left: 20px;
`;

export const SubEventTitle = styled.Text`
  color: #e04113;
  font-size: 17px;
  font-family: 'RobotoSlab-Medium';
  line-height: 20px;
  margin: 16px 16px 0 16px;
`;

export const SubEventDescription = styled.Text`
  color: #777;
  font-size: 15px;
  font-family: 'RobotoSlab-Medium';
  line-height: 20px;
  margin: 16px;
  align-self: center;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const ParticipantsList = styled(FlatList)`
  padding: 16px;
`;

export const ListTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #777;
  font-size: 20px;
  margin-bottom: 16px;
`;

export const ParticipantsListContainer = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;

  background: #ddd;
  border-radius: 10px;
`;

export const ParticipantsInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const ParticipantsInfoTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 15px;
  color: #555;
`;

export const FormContainer = styled(Form)`
  width: 100%;
  flex-direction: row;
  flex: 1;
  padding: 16px;
  align-items: center;
`;

export const InputCode = styled.TextInput`
  width: 100%;
  flex-direction: row;
  flex: 0.7;

  height: 50px;
  padding: 0 16px;
  background: #fff;

  align-items: center;

  border-radius: 10px;
  border-width: 2px;
  border-color: #fff;
`;

export const ButtonSendCode = styled(RectButton)`
  width: 100%;
  flex-direction: row;
  flex: 0.3;
  width: 100%;
  height: 50px;
  background: #ed6707;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

export const ButtonSendCodeText = styled.Text`
  color: #eee;
  font-size: 17px;
  font-family: 'RobotoSlab-Medium';
`;
