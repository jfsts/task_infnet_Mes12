import { TextInput } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

export default function Input({
  label,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  disabled,
  ...props
}) {
  const { theme, isDarkTheme } = useTheme();

  const inputTheme = {
    colors: {
      ...theme.colors,
      background: isDarkTheme ? "#333333" : "#ffffff",
      surface: isDarkTheme ? "#333333" : "#ffffff",
      placeholder: isDarkTheme ? "#aaaaaa" : "#666666",
      text: theme.colors.text,
      primary: theme.colors.primary,
      onSurfaceVariant: theme.colors.text,
    },
  };

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      disabled={disabled}
      style={[
        {
          marginBottom: 10,
          borderRadius: 4,
          backgroundColor: inputTheme.colors.background,
        },
        props.style,
      ]}
      theme={inputTheme}
      textColor={theme.colors.text}
      placeholderTextColor={inputTheme.colors.placeholder}
      underlineColor={isDarkTheme ? "#666666" : "#cccccc"}
      activeUnderlineColor={theme.colors.primary}
      mode="flat"
      {...props}
    />
  );
}
