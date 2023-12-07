import { EditIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserBadge from '../userItems/UserBadge';
import axios from 'axios';
import UserListItem from '../userItems/UserListItem';

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleAdd = async (userToAdd) => {    
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
        return;
    }

    if (!(selectedChat.groupAdmin.find((u) => u._id === user._id))) {
        toast({
            title: "Error occurred",
            description: "Only group admins can add users",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }

        const { data } = await axios.put("/api/chat/groupadd",
            { chatId: selectedChat._id, userId: userToAdd._id },
            config
        );

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
    } catch (error) {
        toast({
            title: "Error occurred",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        setLoading(false);
    }
  };

  const handleDelete = async (userToDelete) => {
    if (!(selectedChat.groupAdmin.find((u) => u._id === user._id))
        && userToDelete._id !== user._id) {
        toast({
            title: "Error occurred",
            description: "Only group admins can remove other users",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }

        const { data } = await axios.put("/api/chat/groupremove",
            { chatId: selectedChat._id, userId: userToDelete._id },
            config
        );

        userToDelete._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
    } catch (error) {
        toast({
            title: "Error occurred",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        setLoading(false);
    }
  };
  
  const handleRename = async () => {
    if (!groupName) return;

    try {
        setRenameLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }

        const { data } = await axios.put("/api/chat/rename",
            { chatId:selectedChat._id, chatName: groupName },
            config
        );

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
    } catch (error) {
        toast({
            title: "Error occurred",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        setRenameLoading(false);
    }

    setGroupName("");
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }

        const { data } = await axios.get(`/api/user?search=${search}`, config);
        
        setLoading(false);
        setSearchResult(data);
    } catch (error) {
        toast({
            title: "Error occurred",
            description: "Failed to load search results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left"
        });
    }
  };

  return (
    <>
      <IconButton display = {{ base: "flex" }} icon={<EditIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="Noto Sans" display="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map(u => (
                    <UserBadge
                        key={u._id}
                        user={u}
                        handleFunction={() => handleDelete(u)}
                    />
                ))}
            </Box>
            <FormControl display="flex">
                <Input
                    placeholder="Chat name"
                    mb={3}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <Button
                    variant="solid"
                    colorScheme="teal"
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                >
                    Update
                </Button>
            </FormControl>
            <FormControl>
                <form onSubmit={handleSearch}>
                <Box display="flex" pb={2}>
                    <Input
                        placeholder="Add users"
                        mb={1}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}><i className="fas fa-search"></i></Button>
                </Box>
                </form>
            </FormControl>

            {loading ? <Spinner size="lg" /> : (
                searchResult?.slice(0, 4).map(u => (
                    <UserListItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleAdd(u)}
                    />
                ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => handleDelete(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupModal