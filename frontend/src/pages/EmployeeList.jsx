import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image as ChakraImage, // Rename Image to ChakraImage to avoid conflict
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function EmployeeList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: '',
    image: null,
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const toast = useToast();
  const token = Cookies.get('token');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/employees/get', {
        headers: {
          Authorization: token,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching employees. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (employeeId) => {
    console.log(`Edit employee with ID: ${employeeId}`);
    // Implement edit functionality as per your requirement
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:8080/employees/delete/${employeeId}`, {
          headers: {
            Authorization: token,
          },
        });
        toast({
          title: 'Success',
          description: 'Employee deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchEmployees(); // Refresh employee list after deletion
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast({
          title: 'Error',
          description: 'An error occurred while deleting the employee. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] }); // Update image field in formData
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, mobile, designation, gender, course, image } = formData;

    if (!name || !email || !mobile || !designation || !gender || !course || !image) {
      setError('Please fill in all fields.');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', name);
    formDataToSubmit.append('email', email);
    formDataToSubmit.append('mobile', mobile);
    formDataToSubmit.append('designation', designation);
    formDataToSubmit.append('gender', gender);
    formDataToSubmit.append('course', course);
    formDataToSubmit.append('image', image);

    console.log(formDataToSubmit,"form data")
    try {
      const response = await axios.post('http://localhost:8080/employees/create', formDataToSubmit, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast({
          title: 'Success',
          description: 'Employee created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
        setFormData({
          name: '',
          email: '',
          mobile: '',
          designation: '',
          gender: '',
          course: '',
          image: null,
        });
        fetchEmployees(); // Refresh employee list after creation
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during employee creation. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Navbar />
      <Box p={4}>
        <Button colorScheme="teal" onClick={onOpen}>
          Create Employee
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Employee</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormControl id="name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                </FormControl>
                <FormControl id="email" isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                </FormControl>
                <FormControl id="mobile" isRequired>
                  <FormLabel>Mobile</FormLabel>
                  <Input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
                </FormControl>
                <FormControl id="designation" isRequired>
                  <FormLabel>Designation</FormLabel>
                  <Select name="designation" value={formData.designation} onChange={handleChange}>
                    <option value="">Select designation</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                  </Select>
                </FormControl>
                <FormControl id="gender" isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </FormControl>
                <FormControl id="course" isRequired>
                  <FormLabel>Course</FormLabel>
                  <Select name="course" value={formData.course} onChange={handleChange}>
                    <option value="">Select course</option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    <option value="BSC">BSC</option>
                    <option value="B.tech">B.tech</option>
                  </Select>
                </FormControl>
                <FormControl id="image" isRequired>
                  <FormLabel>Upload Image</FormLabel>
                  <Input type="file" name="image" accept="image/jpeg,image/jpg,image/png" onChange={handleChange} />
                </FormControl>
                {error && (
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}
                <ModalFooter>
                  <Button colorScheme="teal" type="submit">
                    Submit
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Box overflowX="auto" mt={4}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>User Id</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Mobile</Th>
                <Th>Designation</Th>
                <Th>Gender</Th>
                <Th>Course</Th>
                <Th>Image</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {employees.map((employee) => (
                <Tr key={employee._id}>
                  <Td>{employee.userId}</Td>
                  <Td>{employee.name}</Td>
                  <Td>{employee.email}</Td>
                  <Td>{employee.mobile}</Td>
                  <Td>{employee.designation}</Td>
                  <Td>{employee.gender}</Td>
                  <Td>{employee.course}</Td>
                  <Td>
                    <ChakraImage src={employee.image} alt={employee.name} boxSize="100px" />
                  </Td>
                  <Td>
                    <Button colorScheme="blue" size="sm" onClick={() => handleEdit(employee._id)}>
                      Edit
                    </Button>
                  </Td>
                  <Td>
                    <Button colorScheme="red" size="sm" ml={2} onClick={() => handleDelete(employee._id)}>
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
