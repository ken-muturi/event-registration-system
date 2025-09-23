import { useUX } from '@/context/UXContext'
import { Badge, HStack, IconButton } from '@chakra-ui/react'
import React from 'react'
import { dictionary } from '../dictionary'
import Modal from '@/components/Generic/Modal'
import Form from '../Form'
import { MdModeEdit } from 'react-icons/md'
import DeleteQuestionnaire from './DeleteQuestionnaire'
import { QuestionnaireDetail } from '../type'

const Actions = ({data}: {data:QuestionnaireDetail}) => {
    const { translate, } = useUX()
  return (
    <HStack>
      <Badge
        size="xs"
        _hover={{ colorScheme: "black" }}
        colorScheme="purple"
        px={2}
        as="a"
      >
        {translate(dictionary.view)}
      </Badge>
      <Badge
        size="xs"
        _hover={{ colorScheme: "black" }}
        colorScheme="blue"
        px={2}
        as="a"
      >
        {translate(dictionary.edit)}
      </Badge>
      <Badge
        size="xs"
        _hover={{ colorScheme: "black" }}
        colorScheme="red"
        px={2}
        py="2px"
      >
        {translate(dictionary.access)}
      </Badge>
      <Modal
        size="lg"
        vh="75vh"
        title={`${translate(dictionary.editQuestionnaire)} ${translate(
          data.title
        )}`}
        mainContent={<Form questionnaire={data} />}
      >
        <IconButton
          cursor="pointer"
          size="xs"
          borderRadius="full"
          color="gray.600"
          _hover={{
            bg: "warchild.blue.default",
            color: "warchild.white.default",
          }}
          as={MdModeEdit}
          aria-label={translate(dictionary.editQuestionnaire)}
        />
      </Modal>
      <DeleteQuestionnaire disabled={data.hasSections} id={data.id} />
    </HStack>
  );
}

export default Actions