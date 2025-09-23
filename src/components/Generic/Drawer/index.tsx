import { DrawerProps, type SlideDirection } from "@chakra-ui/react";
import React from "react";

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

type CustomDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: string;
  placement?: SlideDirection;
} & DrawerProps;

const CustomDrawer = ({
  isOpen,
  onClose,
  title = "",
  size = "sm",
  placement = "right",
  children,
}: CustomDrawerProps) => {
  return (
    <Drawer size={size} isOpen={isOpen} placement={placement} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        {title && <DrawerHeader>{title}</DrawerHeader>}
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
