import { Button as PaperButton } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

export default function Button({
  mode = "contained",
  onPress,
  style,
  loading,
  disabled,
  children,
  ...props
}) {
  const { theme } = useTheme();

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      style={[
        {
          marginTop: 10,
        },
        style,
      ]}
      theme={theme}
      loading={loading}
      disabled={disabled}
      {...props}
    >
      {children}
    </PaperButton>
  );
}
