/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input, Group, Icon } from "@chakra-ui/react";
import { LuCalendar } from "react-icons/lu";

interface CustomInputProps {
  variant?: string;
  [key: string]: any;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
    return (
        <Group w="full" borderRadius="lg">
            <Icon color="gray.500">
                <LuCalendar />
            </Icon>
            <Input {...props} ref={ref} size="sm" borderRadius="lg" />
        </Group>
    );
});

CustomInput.displayName = "CustomInput";

export default CustomInput;