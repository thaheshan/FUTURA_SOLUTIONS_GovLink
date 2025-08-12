/* eslint-disable no-undef */
import { ReactNode } from "react";
import { Text } from "@components/ui/text";

export const UiText = ({
  children,
  className,
  style,
  ...props
}: {
  children: ReactNode;
  className?: string;
  style?: object;
} & React.ComponentProps<typeof Text> & {
  [key: string]: any;
}) => {
  return (
    <Text {...props} className={"text-black dark:text-white " + className} style={style}>
      {children}
    </Text>
  );
};
