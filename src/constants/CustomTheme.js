import {useEffect} from 'react';
import {useColorScheme, Appearance} from 'react-native';

const CustomTheme = () => {
  const colorScheme = useColorScheme();

  const darkmodeColor = colorScheme === 'dark' ? '#fff' : '#000';
  const darkBorderColor = colorScheme === 'dark' ? '#fff' : '#000';
  const darkBackgroundColor = colorScheme === 'dark' ? '#000' : '#fff';

  const handleColorSchemeChange = newColorScheme => {
    if (newColorScheme === 'dark') {
      // Add more actions as needed
    } else {
    }
  };

  useEffect(() => {
    const currentColorScheme = Appearance.getColorScheme();
    handleColorSchemeChange(currentColorScheme);

    const subscription = Appearance.addChangeListener(newColorScheme => {
      handleColorSchemeChange(newColorScheme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    darkmodeColor,
    darkBorderColor,
    darkBackgroundColor,
  };
};

export default CustomTheme;
