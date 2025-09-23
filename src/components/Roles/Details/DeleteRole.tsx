import { handleReturnError } from '@/db/error-handling';
import { deleteRole } from '@/services/Roles';
import { IconButton, useToast } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { FaTimesCircle } from 'react-icons/fa';
import { dictionary } from '../dictionary';
import { useUX } from '@/context/UXContext';

type DeleteRoleProps = {
    id: string
}
const DeleteRole = ({ id }: DeleteRoleProps) => {
    const toast = useToast();
    const { translate } = useUX()
    const queryClient = useQueryClient()

    const handleDeleteRoles = async (id: string) => {
        try {
            await deleteRole(id);
            await queryClient.refetchQueries({ queryKey: ["roles"] });
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
            aria-label={translate(dictionary.deleteRole)}
            onClick={async () => {
                if (id) {
                    await handleDeleteRoles(id);
                }
                else {
                    toast({
                        title: 'error.',
                        description: translate(dictionary.deleteErrorDescription),
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: "top-right"
                    })
                }
            }} />
    )
}
export default DeleteRole