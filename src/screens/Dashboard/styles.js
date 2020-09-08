import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${getStatusBarHeight() + 24}px;
  background: #ed6707;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  color: #fcc;
  font-size: 17px;
  font-family: 'RobotoSlab-Regular';
  line-height: 28px;
`;

export const UserName = styled.Text`
  color: #fff;
  font-size: 19px;
  font-family: 'RobotoSlab-Medium';
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  /* border: 2px solid;
  border-color: #fff; */
`;

export const EventsList = styled(FlatList)`
  padding: 16px;
`;

export const EventsListTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #777;
  font-size: 20px;
  margin-bottom: 16px;
`;

export const EventContainer = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;

  background: #ddd;
  border-radius: 10px;
`;

export const EventImage = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`;

export const EventInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const EventInfoTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 15px;
  color: #555;
`;

export const EventInfoView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const EventInfoText = styled.Text`
  margin-left: 8px;
  color: #777;
  font-family: 'RobotoSlab-Regular';
`;
