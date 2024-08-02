import React from 'react';
import {Image, ImageProps, StyleSheet, TouchableOpacity} from 'react-native';
// import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';

interface AvatarProps extends ImageProps {
  onChange?: (image: ImageOrVideo) => void;
}

export const Avatar = (props: AvatarProps) => {
  const [uri, setUri] = React.useState(props.source?.uri || undefined);

  const pickPicture = () => {
    ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    }).then(image => {
      setUri(image.path);
      props.onChange?.(image);
    });
  };
  return (
    <TouchableOpacity onPress={pickPicture}>
      <Image
          style={styles.avatar}
          {...props}
          source={uri ? {uri} : props.source}
        />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    paddingTop: 20,
    height: 100,
    width: 100,
    borderRadius: 100,
    padding: 20,
  },
});