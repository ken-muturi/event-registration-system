import {
  Box,
  useDisclosure,
  Button,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";

interface IModalProps {
  title?: string;
  children: ReactNode;
  mainContent: ReactNode;
  size?: string;
  isModalOpen?: boolean;
  vh?: string;
  onModalClose?: () => void;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  onClose?: () => void; // this is to trigger  close upon form submit. can be refactored
}

const CustomModal = (props: IModalProps) => {
  const {
    children,
    title,
    mainContent,
    size,
    vh = "50vh",
    footer,
    isModalOpen = false,
  } = props;
  const [open, setOpen] = useState(isModalOpen);
  return (
    <Dialog.Root
      // placement="top"
      open={open} onOpenChange={(e) => setOpen(e.open)}
      size={size === "8xl" ? "full" : (size as "sm" | "md" | "lg" | "xl" | "xs" | "cover" | "full") || "lg"}
      scrollBehavior="inside" 
    >
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            borderRadius="none"
            overflow="auto"
            p={4}
            h={vh}
          >
            {title ? <Dialog.Header><Box fontWeight="bold" fontSize="lg">{title}</Box></Dialog.Header> : ""}
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <Box>{mainContent}</Box>
            </Dialog.Body>
            {footer && (
              <Dialog.Footer>
                {footer}
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>              
              </Dialog.Footer>
            )}
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CustomModal;
