import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/misc/SideDrawer";
import { Box } from "@chakra-ui/react";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";

const Chats = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer/>}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <ChatList fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default Chats;