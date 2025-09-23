import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Button,
  Center,
  CenterProps,
  HStack,
  Icon,
  Square,
  Text,
  VStack,
  createToaster,
} from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';

type DropzoneProps = {
  isInline?: boolean;
  setSelectedFile: (file: File) => void;
  maxSize?: number;
} & CenterProps;

const Dropzone = ({ setSelectedFile, isInline, maxSize, ...props }: DropzoneProps) => {
  const toaster = createToaster({
    placement: "top-end",
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (maxSize && acceptedFiles[0].size > maxSize) {
        toaster.error({
          title: "File size too large",
          description: `File size should be smaller than ${Math.round(
            maxSize / 1024 / 1024
          )}MB`,
        });
        return;
      }
      setSelectedFile(acceptedFiles[0]);
    },
    [maxSize, setSelectedFile, toaster]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Center
      borderWidth="1px"
      borderRadius="lg"
      px="6"
      py={isInline ? 2 : 4}
      bg={'gray.50'}
      {...props}
    >
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <VStack gap="3">
          {!isInline && (
            <Square size="10" bg="bg-subtle" borderRadius="lg">
              <Icon as={FiUploadCloud} boxSize="5" color="muted" />
            </Square>
          )}
          <VStack gap="1">
            <HStack gap="1" whiteSpace="nowrap">
              <Button variant="ghost" colorScheme="blue" size="sm">
                Click to upload file
              </Button>
              <Text fontSize="sm" color="muted">
                or drag and drop
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </div>
    </Center>
  );
};

export default Dropzone;
