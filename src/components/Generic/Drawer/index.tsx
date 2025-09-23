import { Drawer } from "@chakra-ui/react";
import React from "react";

type CustomDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  placement?: "start" | "end" | "top" | "bottom";
  children: React.ReactNode;
};

const CustomDrawer = ({
  isOpen,
  onClose,
  title = "",
  size = "sm",
  placement = "end",
  children,
}: CustomDrawerProps) => {
  return (
    <Drawer.Root
      size={size}
      open={isOpen}
      placement={placement}
      onOpenChange={(e) => !e.open && onClose()}
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.CloseTrigger />
          {title && (
            <Drawer.Header>
              <Drawer.Title>{title}</Drawer.Title>
            </Drawer.Header>
          )}
          <Drawer.Body>{children}</Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default CustomDrawer;
