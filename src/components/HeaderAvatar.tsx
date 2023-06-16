
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Avatar } from 'native-base';
import { useUserContext } from '../../service/UserContext';

const HeaderAvatar: React.FC = () => {
  const userData = useUserContext();

  return (
    <TouchableOpacity style={{ paddingRight: 15 }}>
      <Avatar bg="#EF6F20">
        {userData && userData.email ? userData.email[0].toUpperCase() : 'A'}
      </Avatar>
    </TouchableOpacity>
  );
};

export default HeaderAvatar;