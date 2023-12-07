import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
        {children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton
                display={{ base: "flex" }}
                icon={<ViewIcon />}
                onClick={onOpen}
            />
        )}
        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h="350px">
            <ModalHeader
                fontFamily="Noto Sans"
                display="flex"
                justifyContent="center"
            >{user.username}</ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={user.picture}
                    alt={user.username}
                />
                <Text
                    fontFamily="Noto Sans"
                >
                    Email: {user.email}
                </Text>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  );
}

export default ProfileModal