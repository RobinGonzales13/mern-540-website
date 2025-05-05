import { useEffect, useState } from "react";
import { 
    Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading, Button, Flex, Switch, Text, HStack
} from "@chakra-ui/react";
import axios from "axios";

const Inventory = () => {
    const [inventoryType, setInventoryType] = useState("adf");
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("asc");

    useEffect(() => {
        fetchData();
    }, [currentPage, sortBy, order, inventoryType]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/${inventoryType}?page=${currentPage}&limit=25&sortBy=${sortBy}&order=${order}`);
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
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Pagination Buttons */}
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
        </Box>
    );
};

export default Inventory;
