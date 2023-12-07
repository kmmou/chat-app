import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!username || !password) {
        toast({
            title: "Please enter all required information",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setLoading(false);
        return;
    }

    try {
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }

        const { data } = await axios.post(
            "/api/user/login",
            { username, password },
            config
        );

        toast({
            title: "Login successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
    } catch (error) {
        toast({
            title: "Error",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
        setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
        <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
                <form onSubmit={submitHandler}>
                    <Input
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </form>
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
                <form onSubmit={submitHandler}>
                    <InputGroup>
                        <Input
                            type={show ? "text" : "password"}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                                {show ? <i className="fas fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </form>
        </FormControl>

        <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15}}
            onClick={submitHandler}
            isLoading={loading}
        >Login</Button>
    </VStack>
  )
}

export default Login