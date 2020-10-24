import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: getBottomSpace()
  }
})``;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 18px;
  margin-left: 10px;
  font-family: 'RobotoSlab-Medium';
  line-height: 28px;
`;

export const SubEventsList = styled(FlatList)`
  padding: 16px;
`;

export const SubEventContainer = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;

  background: #ddd;
  border-radius: 10px;
`;

export const SubEventInfo = styled.View`
  flex: 1;
  /* margin-left: 10px; */
`;

export const SubEventInfoTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 15px;
  color: #555;
`;

export const SubEventInfoView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const SubEventInfoText = styled.Text`
  margin-left: 8px;
  color: #777;
  font-family: 'RobotoSlab-Regular';
`;
