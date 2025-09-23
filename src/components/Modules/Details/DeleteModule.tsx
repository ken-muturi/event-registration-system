import { useUX } from '@/context/UXContext';
import { handleReturnError } from '@/db/error-handling';
import { deleteModule } from "@/services/Modules";
import { IconButton, useToast } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { FaTimesCircle } from 'react-icons/fa';
import { dictionary } from '../dictionary';

type DeleteModuleProps = {
    id: string
}
const DeleteModule = ({ id }: DeleteModuleProps) => {
    const toast = useToast();
    const queryClient = useQueryClient()
    const { translate } = useUX()
    const handleDeleteModule = async (id: string) => {
        try {
            await deleteModule(id);
            await queryClient.refetchQueries({ queryKey: ["modules"] });
            toast({
                title: translate(dictionary.success),
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            const message = handleReturnError(error);
            toast({
                title: translate(dictionary.deleteError),
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
            aria-label={translate(dictionary.deleteModule)}
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
                    await handleDeleteModule(id);
                }
            }} />
    )
}
export default DeleteModule