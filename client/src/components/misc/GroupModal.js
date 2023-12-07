import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userItems/UserListItem';
import UserBadge from '../userItems/UserBadge';

const GroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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

  const handleSubmit = async () => {
    if (!groupName) {
        toast({
            title: "Enter group chat name",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top"
        });
        return;
    }

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }
        
        const { data } = await axios.post("/api/chat/group", {
            chatName: groupName,
            users: JSON.stringify(selectedUsers.map(u => u._id))
        }, config);

        setChats([data, ...chats]);
        onClose();
        toast({
            title: "New group chat created",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
    } catch (error) {
        toast({
            title: "Error occurred",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
    }
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
        return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Noto Sans"
            display="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
                <Input
                    placeholder="Chat name"
                    mb={3}
                    onChange={(e) => setGroupName(e.target.value)}
                />
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

            <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                    <UserBadge
                        key={u._id}
                        user={u}
                        handleFunction={() => handleDelete(u)}
                    />
                ))}
            </Box>

            {loading ? <Spinner size="lg" /> : (
                searchResult?.slice(0, 4).map(u => (
                    <UserListItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleGroup(u)}
                    />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupModal