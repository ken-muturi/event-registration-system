import { handleReturnError } from '@/db/error-handling';
import { deleteTab } from '@/services/Tabs';
import { IconButton, useToast } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { FaTimesCircle } from 'react-icons/fa';
import { dictionary } from '../dictionary';
import { useUX } from '@/context/UXContext';

type DeleteTabProps = {
    id: string
}
const DeleteTab = ({ id }: DeleteTabProps) => {
    const toast = useToast();
    const queryClient = useQueryClient()
    const { translate } = useUX();

    const handleDeleteTabs = async (id: string) => {
        try {
            await deleteTab(id);
            await queryClient.refetchQueries({ queryKey: ["tabs"] });
            toast({
                title: translate(dictionary.success),
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            const message = handleReturnError(error);
            toast({
                title: translate(dictionary.error),
                description: message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }

    return (
        <IconButton size="3" cursor={id ? "default" : "pointer"}
            color={id ? "red" : "gray"} as={FaTimesCircle}
            aria-label={translate(dictionary.deleteTab)}
            onClick={async () => {
                if (id) {
                    toast({
                        title: translate(dictionary.error),
                        description: translate(dictionary.deleteErrorDescription),
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: "top-right"
                    })
                }
                else {
                    await handleDeleteTabs(id);
                }
            }} />
    )
}
export default DeleteTab