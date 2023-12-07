import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogic';
import GroupModal from './misc/GroupModal';

var selectedChatCompare;

const ChatList = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats, notif, setNotif } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }

        const { data } = await axios.get("/api/chat", config);
        setChats(data);
    } catch (error) {
        toast({
            title: "Error occurred",
            description: "Failed to load chats",
            status: "error",
            duration: 5000,
            position: "bottom-left"
        });
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  useEffect(() => {
    fetchChats();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  return (
    <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
    >
        <Box
            pb={3}
            px={3}
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily="Noto Sans"
            display="flex"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
        >
            Chats
            <GroupModal>
                <Button
                    display="flex"
                    fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                    rightIcon={<AddIcon />}
                >
                    New Group Chat
                </Button>
            </GroupModal>
        </Box>

        <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
        >
            {chats ? (
                <Stack overflowY="scroll">
                    {chats.map((chat) => (
                        <Box
                            onClick={() => {
                                setSelectedChat(chat);
                                setNotif(notif.filter(c => c._id === chat._id));
                            }}
                            cursor="pointer"
                            bg={selectedChatCompare?._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                            color={selectedChatCompare?._id === chat._id ? "white" : "black"}
                            px={3}
                            py={2}
                            borderRadius="lg"
                            key={chat._id}
                        >
                            <Text fontWeight="600" noOfLines={1}>
                                {!chat.isGroupChat
                                ? getSender(loggedUser, chat.users)
                                : chat.chatName}
                            </Text>
                            <Text
                                noOfLines={1}
                                fontWeight={notif.includes(chat._id) ? "700" : "400"}
                            >
                                {chat.isGroupChat
                                ? `${chat.latestMessage.sender.username}: `
                                : ""}
                                {chat.latestMessage.content}
                            </Text>
                        </Box>
                    ))}
                </Stack>
            ) : (
                <ChatLoading />
            )}
        </Box>
    </Box>
  );
}

export default ChatList;