'use client'

import { deleteUser } from "@/services/Users";
import { IconButton, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FaTimesCircle } from "react-icons/fa";

type deleteUserProps = {
  id: string;
};
const DeleteUsers = ({ id }: deleteUserProps) => {
  const toast = useToast();

  const queryClient = useQueryClient();

  const deleteUserDetail = async (id: string) => {
    await deleteUser(id);

    queryClient.refetchQueries({ queryKey: ["users"] });

    toast({
      title: "success.",
      description: "User delete",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <IconButton
      size="3"
      cursor="pointer"
      color="red.500"
      as={FaTimesCircle}
      aria-label="delete product"
      onClick={async () => {
        await deleteUserDetail(id.toString());
      }}
    />
  );
};

export default DeleteUsers