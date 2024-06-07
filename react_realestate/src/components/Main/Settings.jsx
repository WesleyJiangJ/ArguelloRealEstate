import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllPlots } from "../../api/apiFunctions";
import { Button, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Input, Chip, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/solid"
import PlotModal from "./PlotModal";

export default function Settings() {
    const navigate = useNavigate();
    const param = useParams();
    const location = useLocation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [plot, setPlot] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [filterValue, setFilterValue] = React.useState(3);
    const [filterData, setFilterData] = React.useState("");

    const columns = [
        { name: "Lote", uid: "plot" },
        { name: "Precio", uid: "price" },
        { name: "Estado", uid: "status" },
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

    // Search
    const filteredPlots = plot.filter(info => {
        if (filterData === 3) {
            return info.number.includes(searchValue)
        }
        return info.status === filterData && info.number.includes(searchValue);
    });

    const filter = (e) => {
        setFilterValue(Number(e.target.value));
    };

    // Filter
    React.useEffect(() => {
        if (filterValue === 0) setFilterData(0)
        else if (filterValue === 1) setFilterData(1)
        else if (filterValue === 2) setFilterData(2)
        else setFilterData(3)
    }, [filterValue]);

    const statusColorMap = {
        0: "primary",
        1: "warning",
        2: "success"
    };

    const statusOptions = {
        0: "Disponible",
        1: "Proceso",
        2: "Vendido"
    };

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
            case "status":
                return (
                    <Chip className="capitalize my-2" color={statusColorMap[plot.status]} size="sm" variant="flat">
                        {statusOptions[plot.status]}
                    </Chip>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="flex flex-col h-full">
            <Tabs
                aria-label="Options"
                color="primary"
                radius="sm"
                fullWidth
                className="flex-grow">
                <Tab key="plots" title="Lotes" className="flex flex-col h-full">
                    <div className="flex flex-row gap-2">
                        <div className='w-full'>
                            <Input
                                type="text"
                                label="Buscar"
                                radius='sm'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        <div>
                            <Select
                                label="Filtrar"
                                onChange={filter}
                                defaultSelectedKeys={'3'}
                                className="w-28 md:w-32"
                                radius="sm"
                                disallowEmptySelection>
                                <SelectItem key={3} value={3}>Todos</SelectItem>
                                <SelectItem key={0} value={0}>Disponible</SelectItem>
                                <SelectItem key={1} value={1}>Proceso</SelectItem>
                                <SelectItem key={2} value={2}>Vendido</SelectItem>
                            </Select>
                        </div>
                        <div>
                            <Button
                                radius='sm'
                                color="primary"
                                className='p-3 h-full w-full'
                                isIconOnly
                                onPress={onOpen}>
                                <PlusIcon className="h-7 w-7" />
                            </Button>
                        </div>
                    </div>
                    <Table
                        aria-label="Plot Table"
                        radius="sm"
                        selectionMode="single"
                        shadow="none"
                        className="flex-grow overflow-auto"
                        onRowAction={(key) => {
                            navigate(`plot/${key}`);
                            onOpenChange(true);
                        }}>
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody emptyContent={"No hubieron resultados"} items={filteredPlots}>
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
                </Tab>
            </Tabs>
            <PlotModal isOpen={isOpen} onOpenChange={onOpenChange} loadPlot={loadPlots} param={param} modifyURL={modifyURL} />
        </div>
    )
}