import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllPlots } from "../../api/apiFunctions";
import { Button, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure } from "@nextui-org/react";
import PlotModal from "./PlotModal";

export default function Settings() {
    const navigate = useNavigate();
    const param = useParams();
    const location = useLocation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [plot, setPlot] = React.useState([]);

    const columns = [
        { name: "Lote", uid: "plot" },
        { name: "Precio", uid: "price" },
    ];

    React.useEffect(() => {
        loadPlots();
    }, []);

    const loadPlots = async () => {
        setPlot((await getAllPlots()).data);
    }

    const modifyURL = () => {
        const currentPath = location.pathname;
        const newPath = currentPath.split(`/plot/${param.id}`).filter((segment) => segment !== param.id && segment !== param.slug).join('');
        navigate(newPath);
    }

    const renderCell = React.useCallback((plot, columnKey) => {
        const cellValue = plot[columnKey];
        switch (columnKey) {
            case "plot":
                return (
                    <p className="text-bold text-small capitalize">{plot.number}</p>
                );
            case "price":
                return (
                    <p className="text-bold text-small capitalize">${parseFloat(plot.price).toLocaleString()}</p>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <>
            <Tabs
                aria-label="Options"
                color="primary"
                radius="sm"
                fullWidth>
                <Tab key="plots" title="Lotes">
                    <Table
                        aria-label="Plot Table"
                        radius="sm"
                        selectionMode="single"
                        shadow="none"
                        onRowAction={(key) => {
                            navigate(`plot/${key}`);
                            onOpenChange(true);
                        }}>
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody emptyContent={"No hubieron resultados"} items={plot}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) =>
                                        <TableCell className="cursor-pointer">
                                            {renderCell(item, columnKey)}
                                        </TableCell>
                                    }
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Button
                        className="w-full mt-2"
                        color="primary"
                        radius="sm"
                        size="lg"
                        onPress={onOpen}>
                        Nuevo Lote
                    </Button>
                </Tab>
            </Tabs>
            <PlotModal isOpen={isOpen} onOpenChange={onOpenChange} loadPlot={loadPlots} param={param} modifyURL={modifyURL} />
        </>
    )
}