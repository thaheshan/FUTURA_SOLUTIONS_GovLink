import React from "react";
import { Button } from "@components/ui/button";
import { Text } from "@components/ui/text";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const UiButton = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      size="xl"
      className={
        "bg-transparent rounded-md px-3 py-1 shadow-0 border border-[#6D28D9] " +
        className
      }
    >
      {children}
    </Button>
  );
};

export const UiFilledButton = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      size="xl"
      className={
        "bg-[#6D28D9] text-white rounded-md px-3 py-1 shadow-0 " + className
      }
    >
      <Text>{children}</Text>
    </Button>
  );
};

export const UiOutlinedButton = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      size="xl"
      className={
        "bg-transparent text-[#6D28D9] rounded-md px-1 py-1 shadow-0 border border-[#6D28D9] " +
        className
      }
    >
      {children}
    </Button>
  );
};
