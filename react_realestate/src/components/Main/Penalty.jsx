import React from "react";
import { useForm, Controller } from "react-hook-form"
import { getPenalty, getPenaltyPayment, patchPenalty, postPenaltyPayment } from "../../api/apiFunctions";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Select, SelectItem, Tab, Tabs, Card, CardBody } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { sweetAlert } from "./Alert";

export default function Penalty({ isOpen, onOpenChange, id_sale, showPenalty }) {
    // const [penaltyHistory, setPenaltyHistory] = React.useState([]);
    const [penaltyData, setPenaltyData] = React.useState([]);
    const [penaltyPayment, setPenaltyPayment] = React.useState([]);
    const { control, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm({
        defaultValues: {
            id_penalty: '',
            amount: '',
            payment_type: 0
        }
    });

    React.useEffect(() => {
        loadData();
    }, [showPenalty]);

    const loadData = async () => {
        const resPenalty = (await getPenalty(id_sale)).data;
        if (resPenalty.length !== 0) {
            setPenaltyData(resPenalty);
            setPenaltyPayment((await getPenaltyPayment(resPenalty[0].id)).data);
            // setPenaltyHistory((await getPenaltyHistory(resPenalty[0].id)).data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        }
        else {
            setPenaltyData([{ total: 0 }])
        }
    }
    // const columns = [
    //     { name: "Mes", uid: "month" },
    //     { name: "Mensualidad", uid: "monthly_installments" },
    //     { name: "Pago", uid: "monthly_amount" },
    //     { name: "Mora", uid: "penalty" },
    // ];
    // const renderCell = React.useCallback((data, columnKey) => {
    //     const cellValue = data[columnKey];
    //     switch (columnKey) {
    //         case "month":
    //             return (
    //                 <p className="text-bold text-small capitalize">{data.date}</p>
    //             );
    //         case "monthly_installments":
    //             return (
    //                 <p className="text-bold text-small capitalize">${parseFloat(data.monthly_debt).toLocaleString()}</p>
    //             );
    //         case "monthly_amount":
    //             return (
    //                 <p className="text-bold text-small capitalize">${parseFloat(data.total_debt).toLocaleString()}</p>
    //             );
    //         case "penalty":
    //             return (
    //                 <p className="text-bold text-small capitalize">${data.penalty}</p>
    //             );
    //         default:
    //             return cellValue;
    //     }
    // }, []);

    const onSubmit = async (data) => {
        await sweetAlert(`¿Deseas agregar $${data.amount}?`, `En concepto de ${data.payment_type === 0 ? 'pago' : 'exoneración'}`, 'question', 'success', 'Hecho');
        data.id_penalty = penaltyData[0].id;
        await postPenaltyPayment(data).then(async () => {
            await patchPenalty(penaltyData[0].id, { total: parseFloat(penaltyData[0].total) - parseFloat(data.amount) }).then(() => {
                reset();
                loadData();
            });
        });
    }
    return (
        <>
            <Modal
                radius="sm"
                size="5xl"
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={() => {
                    onOpenChange();
                    reset();
                }}
                isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-2">Mora</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex flex-row gap-2 items-center">
                                        <Input label="Mora Total" variant="underlined" isReadOnly value={`$${parseFloat(penaltyData[0].total).toLocaleString()}`} />
                                        {parseFloat(penaltyData[0].total) !== 0 &&
                                            <>
                                                <Controller
                                                    name="amount"
                                                    control={control}
                                                    rules={{
                                                        required: true,
                                                        pattern: {
                                                            value: /^\d+(\.\d{1,2})?$/
                                                        },
                                                        validate: value => {
                                                            if (parseFloat(value) > parseFloat(penaltyData[0].total)) {
                                                                return 'The amount cannot be higher than the total field';
                                                            }
                                                            else {
                                                                return true;
                                                            }
                                                        }
                                                    }}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            label='Monto a pagar'
                                                            variant="underlined"
                                                            startContent={'$'}
                                                            placeholder="0.00"
                                                            isInvalid={errors.amount ? true : false}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                if (parseFloat(e.target.value) > parseFloat(penaltyData[0].total)) {
                                                                    setError('amount');
                                                                }
                                                                else if (parseFloat(e.target.value) < 0) {
                                                                    setError('amount');
                                                                }
                                                                else {
                                                                    clearErrors('amount');
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name="payment_type"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="Tipo"
                                                            defaultSelectedKeys={'0'}
                                                            radius="sm"
                                                            variant="underlined"
                                                            disallowEmptySelection
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                            }}>
                                                            <SelectItem key={0} value={0}>Pago</SelectItem>
                                                            <SelectItem key={1} value={1}>Exoneración</SelectItem>
                                                        </Select>
                                                    )}
                                                />
                                                <Button color="primary" radius="sm" size="lg" isIconOnly type="submit">
                                                    <PlusIcon className="w-5 h-5" />
                                                </Button>
                                            </>
                                        }
                                    </div>
                                </form>
                                <Tabs aria-label="Options" fullWidth radius="sm" color="primary">
                                    <Tab key="paid" title="Pagado">
                                        <Card shadow="none" radius="sm" className="h-96">
                                            <CardBody>
                                                <Table
                                                    aria-label="Penalty Table"
                                                    radius="sm"
                                                    shadow="none"
                                                    className="flex-grow overflow-auto">
                                                    <TableHeader>
                                                        <TableColumn>Monto Pagado</TableColumn>
                                                        <TableColumn>Tipo</TableColumn>
                                                    </TableHeader>
                                                    <TableBody emptyContent={"No hubieron resultados"}>
                                                        {penaltyPayment.map((row) =>
                                                            <TableRow key={row.id}>
                                                                <TableCell>${row.amount}</TableCell>
                                                                <TableCell>{row.payment_type === 0 ? 'Pago' : 'Exoneración'}</TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </CardBody>
                                        </Card>
                                    </Tab>
                                    {/* <Tab key="details" title="Detalles">
                                        <Card shadow="none" radius="sm" className="h-96">
                                            <CardBody>
                                                <Table
                                                    aria-label="Penalty Table"
                                                    radius="sm"
                                                    shadow="none"
                                                    className="flex-grow overflow-auto">
                                                    <TableHeader columns={columns}>
                                                        {(column) => (
                                                            <TableColumn key={column.uid}>
                                                                {column.name}
                                                            </TableColumn>
                                                        )}
                                                    </TableHeader>
                                                    <TableBody emptyContent={"No hubieron resultados"} items={penaltyHistory}>
                                                        {(item) => (
                                                            <TableRow key={item.month}>
                                                                {(columnKey) =>
                                                                    <TableCell>
                                                                        {renderCell(item, columnKey)}
                                                                    </TableCell>
                                                                }
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </CardBody>
                                        </Card>
                                    </Tab> */}
                                </Tabs>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" radius="sm" onPress={onClose}>
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}
