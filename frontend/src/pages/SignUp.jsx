import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useColorModeValue,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const newUser = {
        username,
        password,
      };

      const response = await axios.post('http://localhost:8080/users/register', newUser);

      if (response.data.message === 'User with this Username Already Exists!') {
        toast({
          title: 'Error',
          description: 'User with this Username Already Exists!',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Sign Up successful, please log in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setUsername('');
      setPassword('');
      setConfirmPassword('');

      navigate('/login');
    } catch (error) {
      console.error('Error during sign up:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during sign up. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Navbar/>
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue('gray.50', 'gray.800')}
        p={4}
      >
        <Box
          maxW="md"
          w="full"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="lg"
          rounded="lg"
          p={6}
          m={4}
        >
          <Heading as="h2" size="xl" mb={6} textAlign="center" color="teal.500">
            Sign Up
          </Heading>
          <Stack spacing={4} as="form" onSubmit={handleSignUp}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </FormControl>
            <FormControl id="confirm-password" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </FormControl>
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button type="submit" colorScheme="teal" size="lg" mt={4} w="full">
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
