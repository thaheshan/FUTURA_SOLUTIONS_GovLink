import { Input, InputField } from "@components/ui/input";
import { TextInputProps } from "react-native";

interface UiInputProps extends Omit<TextInputProps, 'style'> {
  // eslint-disable-next-line no-undef
  children?: React.ReactNode;
  className?: string;
}

export const UiInput = (props: UiInputProps) => {
  const { children, ...inputProps } = props;
  
  if (children) {
    return (
      <Input className="rounded-md flex-1" size="xl" variant="outline">
        {children}
      </Input>
    );
  }
  return (
    <Input className="rounded-md flex-1" size="xl">
      <InputField className="rounded-md" returnKeyType="send" {...inputProps} />
    </Input>
  );
};
