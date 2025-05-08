import { useEffect, useState } from "react";
import {
    Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading,
    Button, Flex, HStack, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    ModalFooter, Input, FormLabel
} from "@chakra-ui/react";
import axios from "axios";

const Inventory = () => {
    const [inventoryType, setInventoryType] = useState("adf");
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("asc");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, [currentPage, sortBy, order, inventoryType]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://five40airbasegroup-paf-backend.onrender.com/api/${inventoryType}?page=${currentPage}&limit=25&sortBy=${sortBy}&order=${order}`);
            setData(response.data.records);
            setTotalPages(response.data.totalPages);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Error fetching inventory records:", error);
        }
    };

    const handleSort = (column) => {
        setSortBy(column);
        setOrder(order === "asc" ? "desc" : "asc");
    };

    const handleEdit = (record) => {
        setEditingItem(record);
        onOpen();
    };

    const handleEditChange = (field, value) => {
        setEditingItem({ ...editingItem, [field]: value });
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`https://five40airbasegroup-paf-backend.onrender.com/api/${inventoryType}/${editingItem._id}`, editingItem);
            fetchData();
            onClose();
        } catch (error) {
            console.error("Error updating record:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await axios.delete(`https://five40airbasegroup-paf-backend.onrender.com/api/${inventoryType}/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    return (
        <Box p={6}>
            <Flex justify="space-between" align="center" mb={4}>
                <Heading size="lg">{inventoryType.toUpperCase()} Inventory</Heading>
                <HStack spacing={2} w="200px">
                    <Button
                        onClick={() => setInventoryType("adf")}
                        colorScheme={inventoryType === "adf" ? "blue" : "gray"}
                        variant={inventoryType === "adf" ? "solid" : "outline"}
                        flex="1"
                    >
                        ADF
                    </Button>
                    <Button
                        onClick={() => setInventoryType("xcs")}
                        colorScheme={inventoryType === "xcs" ? "blue" : "gray"}
                        variant={inventoryType === "xcs" ? "solid" : "outline"}
                        flex="1"
                    >
                        XCS
                    </Button>
                </HStack>
            </Flex>

            {/* Inventory Table */}
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th cursor="pointer" onClick={() => handleSort("date")}>Date {sortBy === "date" ? (order === "asc" ? "▲" : "▼") : ""}</Th>
                            <Th cursor="pointer" onClick={() => handleSort("controlNumber")}>Control Number {sortBy === "controlNumber" ? (order === "asc" ? "▲" : "▼") : ""}</Th>
                            <Th cursor="pointer" onClick={() => handleSort("purpose")}>Purpose {sortBy === "purpose" ? (order === "asc" ? "▲" : "▼") : ""}</Th>
                            <Th cursor="pointer" onClick={() => handleSort("receivedBy")}>Received By {sortBy === "receivedBy" ? (order === "asc" ? "▲" : "▼") : ""}</Th>
                            <Th cursor="pointer" onClick={() => handleSort("liters")}>Liters {sortBy === "liters" ? (order === "asc" ? "▲" : "▼") : ""}</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((record) => (
                            <Tr key={record._id}>
                                <Td>{new Date(record.date).toLocaleDateString()}</Td>
                                <Td>{record.controlNumber}</Td>
                                <Td>{record.purpose}</Td>
                                <Td>{record.receivedBy}</Td>
                                <Td>{record.liters}</Td>
                                <Td>
                                    <Button size="sm" colorScheme="blue" onClick={() => handleEdit(record)} mr={2}>Edit</Button>
                                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(record._id)}>Delete</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Flex justify="center" mt={4}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        colorScheme={currentPage === index + 1 ? "blue" : "gray"}
                        mx={1}
                    >
                        {index + 1}
                    </Button>
                ))}
            </Flex>

            {/* Edit Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Inventory Record</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormLabel>Date</FormLabel>
                        <Input
                            type="date"
                            value={editingItem?.date?.split("T")[0] || ""}
                            onChange={(e) => handleEditChange("date", e.target.value)}
                        />
                        <FormLabel mt={3}>Control Number</FormLabel>
                        <Input
                            value={editingItem?.controlNumber || ""}
                            onChange={(e) => handleEditChange("controlNumber", e.target.value)}
                        />
                        <FormLabel mt={3}>Purpose</FormLabel>
                        <Input
                            value={editingItem?.purpose || ""}
                            onChange={(e) => handleEditChange("purpose", e.target.value)}
                        />
                        <FormLabel mt={3}>Received By</FormLabel>
                        <Input
                            value={editingItem?.receivedBy || ""}
                            onChange={(e) => handleEditChange("receivedBy", e.target.value)}
                        />
                        <FormLabel mt={3}>Liters</FormLabel>
                        <Input
                            type="number"
                            value={editingItem?.liters || ""}
                            onChange={(e) => handleEditChange("liters", e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>Save</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Inventory;