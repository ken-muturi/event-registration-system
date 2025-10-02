import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { ReactNode, cloneElement, isValidElement } from "react";

interface IModalProps {
  title?: string;
  children: ReactNode;
  mainContent: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "cover" | "full";
  vh?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CustomModal = (props: IModalProps) => {
  const {
    children,
    title,
    mainContent,
    open,
    onOpenChange,
    size = "lg",
    vh,
  } = props;
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      size={size}
      scrollBehavior="inside"
      placement="top"
      motionPreset="slide-in-bottom"
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content {...(vh ? { h: vh } : {})} p={4}>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            {title && (
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
            )}
            <Dialog.Body>{mainContent}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CustomModal;
