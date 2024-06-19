import React from 'react';
import { 
  Box, 
  Flex, 
  HStack, 
  Link, 
  IconButton, 
  Button, 
  useDisclosure, 
  useColorModeValue, 
  Stack,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react';
import Cookies from 'js-cookie'; 
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const Links = (isLoggedIn) => {
  if (isLoggedIn) {
    return [
      { name: 'Home', path: '/' },
      { name: 'EmployeeList', path: '/employeelist' },
    ];
  } else {
    return [
      { name: 'Home', path: '/' },
    ];
  }
};

const Navbar = () => {
  const isLoggedIn = Cookies.get('token')!==undefined ? true : false; // Check if user is logged in
  const token = Cookies.get('token');
  console.log(token)
  const username = Cookies.get('username');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/logout', {
        headers: {
          "Authorization": token
        }
      });
      if (response.data.msg === 'User has been logged out') {
        Cookies.remove('token');
        Cookies.remove('username');
        toast({
          title: 'Logout successful',
          description: 'User has been logged out.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Delay the reload to ensure the toast is visible
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout error',
        description: 'An error occurred during logout. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const bg = useColorModeValue('teal.500', 'teal.900');
  const hoverBg = useColorModeValue('teal.300', 'teal.700');
  const textColor = useColorModeValue('white', 'white');

  return (
    <>
      <Box bg={bg} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Heading color={textColor} size="md">
                Dashboard
              </Heading>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links(isLoggedIn).map((link) =>
                (link.auth === undefined || link.auth === isLoggedIn) ? (
                  <Link
                    key={link.name}
                    as={RouterLink}
                    to={link.path}
                    px={2}
                    py={1}
                    rounded={'md'}
                    _hover={{
                      textDecoration: 'none',
                      bg: hoverBg,
                    }}
                    color={textColor}
                  >
                    {link.name}
                  </Link>
                ) : null
              )}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            {isLoggedIn ? (
              <>
                <Text color={textColor} mr={4}>
                  {username}
                </Text>
                <Button
                  colorScheme={'teal'}
                  variant={'solid'}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                as={RouterLink}
                to="/login"
                colorScheme={'teal'}
                variant={'solid'}
              >
                Login
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links(isLoggedIn).map((link) =>
                (link.auth === undefined || link.auth === isLoggedIn) ? (
                  <Link
                    key={link.name}
                    as={RouterLink}
                    to={link.path}
                    px={2}
                    py={1}
                    rounded={'md'}
                    _hover={{
                      textDecoration: 'none',
                      bg: hoverBg,
                    }}
                    color={textColor}
                  >
                    {link.name}
                  </Link>
                ) : null
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Navbar;
