import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form"
import { Card, CardHeader, CardBody, Button, Input, Textarea, DatePicker, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import { getAllInstallmentByCustomer, getNote, getNotes, getSpecificSale, postInstallment, postNote, deleteNote, patchSale, patchPlot, postComission } from "../../api/apiFunctions"
import { today } from "@internationalized/date";
import { ChatBubbleOvalLeftEllipsisIcon, PlusIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline"
import { sweetAlert, sweetToast } from "./Alert";

export default function SalesDetail() {
    const param = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [saleData, setSaleData] = React.useState([]);
    const [installmentData, setInstallmentData] = React.useState([]);
    const [totalPaid, setTotalPaid] = React.useState(0);
    const [notes, setNotes] = React.useState([]);
    const [noteID, setNoteID] = React.useState('');
    const { control, handleSubmit, formState: { errors }, reset, watch, setError, clearErrors } = useForm({
        defaultValues: {
            id_sale: parseInt(param.id),
            amount: '',
            payment_type: '',
            date: today()
        }
    });
    const { control: controlNote, handleSubmit: handleSubmitNote, formState: { errors: errorsNote }, reset: resetNote } = useForm({
        defaultValues: {
            id: '',
            name: '',
            content: '',
            object_id: parseInt(param.id),
            content_type: 11
        }
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const saleResponse = await getSpecificSale(param.id);
            const saleData = saleResponse.data;
            const id_customer = saleData.customer_data?.id;
            const id_sale = saleData.id;

            setSaleData(saleData);
            setNotes((await getNotes('sale', param.id)).data);

            if (id_customer && id_sale) {
                const installmentResponse = await getAllInstallmentByCustomer(id_customer, id_sale);
                setInstallmentData(installmentResponse.data);
                let totalPaid = 0;
                installmentResponse.data.forEach(element => {
                    totalPaid += parseFloat(element.amount);
                });
                setTotalPaid(totalPaid);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    const onSubmit = async (data) => {
        data.date = data.date.year + '-' + String(data.date.month).padStart(2, '0') + '-' + String(data.date.day).padStart(2, '0');
        const updateData = {
            total_paid: (parseFloat(totalPaid) + parseFloat(watch('amount'))).toFixed(2)
        };
        if (installmentData.length === 0) {
            data.payment_type = 0;
        }
        else {
            data.payment_type = 1;
            updateData.date_paid = data.date;
            if ((parseFloat(totalPaid) + parseFloat(watch('amount'))).toFixed(2) === parseFloat(saleData.plot_data?.price).toFixed(2)) {
                updateData.status = 1;
            }
        }
        await sweetAlert(`¿Deseas agregar $${data.amount}?`, `En concepto de ${installmentData.length === 0 ? 'prima' : 'cuota'}`, 'question', 'success', 'Hecho');
        await postInstallment(data)
            .then(async () => {
                await patchSale(param.id, updateData)
                if (updateData.status === 1) {
                    await patchPlot(saleData.id_plot, { status: 2 });
                    await postComission({ id_personal: saleData.id_personal, id_plot: saleData.id_plot, amount: (parseFloat(saleData.price) * 0.05) });
                }
                sweetToast("success", `Se abonaron $${data.amount}`);
                reset();
                loadData();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const onSubmitNote = async (data) => {
        sweetToast('success', 'Nota guardada');
        await postNote(data)
            .then(() => {
                loadData();
                resetNote();
            })
            .catch((error) => {
                console.error('Error: ', error);
            })
    }

    const columns = [
        { name: "Monto", uid: "amount" },
        { name: "Tipo", uid: "payment_type" },
        { name: "Mes Abonado", uid: "date" },
    ];

    const renderCell = React.useCallback((installment, columnKey) => {
        const cellValue = installment[columnKey];
        switch (columnKey) {
            case "amount":
                return <p className="text-bold text-small capitalize">${installment.amount}</p>
            case "payment_type":
                return <p className="text-bold text-small capitalize">{installment.payment_type === 0 ? 'Prima' : 'Cuota'}</p>
            case "date":
                return <p className="text-bold text-small capitalize">{installment.date}</p>;
            default:
                return cellValue;
        }
    }, []);

    const cancelSale = async () => {
        await sweetAlert('¿Deseas anular la venta?', 'Esta acción es irreversible', 'question', 'success', 'Hecho');
        await patchSale(param.id, { status: 2 })
            .then(async () => {
                await patchPlot(saleData.id_plot, { status: 0 })
                reset();
                loadData();
            });
    }

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <Spinner size="lg" />
                </div>
            ) : (
                <div className="overflow-scroll h-full">
                    <div className="flex flex-col gap-2 h-full">
                        <div className="flex flex-col md:flex-row gap-2 h-full md:h-1/3">
                            <div className="w-full">
                                <Card
                                    radius="sm"
                                    className="bg-card h-full"
                                    shadow="none">
                                    <CardHeader>
                                        <h4 className="font-bold text-medium">Información</h4>
                                    </CardHeader>
                                    <CardBody className="flex flex-col justify-center h-full">
                                        <div className="flex-1 flex flex-col justify-evenly">
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label='Cliente'
                                                    value={`${saleData.customer_data?.first_name} ${saleData.customer_data?.middle_name} ${saleData.customer_data?.first_surname} ${saleData.customer_data?.second_surname}`}
                                                />
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label='Personal'
                                                    value={`${saleData.personal_data?.first_name} ${saleData.personal_data?.middle_name} ${saleData.personal_data?.first_surname} ${saleData.personal_data?.second_surname}`}
                                                />
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label="Lote"
                                                    startContent={'N°'}
                                                    value={String(saleData.plot_data?.number)}
                                                />
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label="Prima"
                                                    startContent={'$'}
                                                    value={String(saleData.premium)}
                                                />
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label="Valor del Lote"
                                                    startContent={'$'}
                                                    value={`${parseFloat(saleData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                />
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label="Cantidad de Cuotas"
                                                    value={String(saleData.installments)}
                                                />
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label="Cuotas Abonadas"
                                                    value={installmentData.length > 1 ? String(installmentData.length - 1) : 0}
                                                />
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label="Cuotas Mensuales"
                                                    startContent={'$'}
                                                    value={String(((saleData.plot_data?.price - saleData?.premium) / saleData?.installments).toFixed(2))}
                                                />
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label="Abonado"
                                                    startContent={'$'}
                                                    value={`${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                />
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label="Restante"
                                                    startContent={'$'}
                                                    value={`${(saleData.price - totalPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="w-full md:w-1/5 flex-grow">
                                <Card
                                    radius="sm"
                                    className="bg-card h-full"
                                    shadow="none">
                                    <CardBody className="grid content-stretch gap-2">
                                        <Button
                                            color="primary"
                                            radius="sm"
                                            className="h-16 m:h-full lg:h-full"
                                            onClick={() => navigate(`/main/sales/detail/${saleData.id}/invoice`)}>
                                            Generar Factura
                                        </Button>
                                        <Button
                                            color="success"
                                            radius="sm"
                                            variant="light"
                                            className="h-16 m:h-full lg:h-full"
                                            onClick={() => window.open("https://wa.me/" + `${saleData.customer_data?.phone_number}`, "_blank")}
                                            startContent={<ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />}>
                                            Enviar Mensaje
                                        </Button>
                                        {saleData.status === 0 &&
                                            <Button
                                                color={'danger'}
                                                radius="sm"
                                                variant="light"
                                                className="h-16 m:h-full lg:h-full"
                                                onClick={() => cancelSale()}>
                                                Anular Venta
                                            </Button>
                                        }
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 h-2/3">
                            <div className="w-full flex-grow">
                                <Card
                                    radius="sm"
                                    className="bg-card h-full"
                                    shadow="none">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <CardHeader>
                                            <div className="flex flex-col w-full">
                                                <h4 className="font-bold text-medium">Detalle de Cuotas</h4>
                                                {saleData.status === 0 &&
                                                    <div className="flex flex-col md:flex-row gap-2 items-center">
                                                        <Controller
                                                            name="amount"
                                                            control={control}
                                                            rules={{
                                                                required: true,
                                                                pattern: {
                                                                    value: /^\d+(\.\d{1,2})?$/
                                                                },
                                                                validate: value => {
                                                                    if (installmentData.length === 0) {
                                                                        if (parseFloat(value) > parseFloat(saleData.premium)) {
                                                                            return 'The amount cannot be higher than the premium field';
                                                                        }
                                                                        else if (parseFloat(value) < parseFloat(saleData.premium)) {
                                                                            return 'The amount cannot be lower than the premium field';
                                                                        }
                                                                    }
                                                                    else if (parseFloat(value) > parseFloat(saleData.plot_data?.price - totalPaid)) {
                                                                        return 'The amount cannot be higher than the debt';
                                                                    }
                                                                    else {
                                                                        return true;
                                                                    }
                                                                }
                                                            }}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    label="Abono"
                                                                    variant="underlined"
                                                                    startContent={'$'}
                                                                    placeholder="0.00"
                                                                    min={1}
                                                                    isInvalid={errors.amount ? true : false}
                                                                    onChange={(e) => {
                                                                        field.onChange(e);
                                                                        if (installmentData.length === 0) {
                                                                            if (parseFloat(e.target.value) > parseFloat(saleData.premium)) {
                                                                                setError('amount');
                                                                            }
                                                                            else if (parseFloat(e.target.value) < parseFloat(saleData.premium)) {
                                                                                setError('amount');
                                                                            }
                                                                            else {
                                                                                clearErrors('amount');
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (parseFloat(e.target.value) > parseFloat(saleData.plot_data?.price - totalPaid)) {
                                                                                setError('amount');
                                                                            }
                                                                            else {
                                                                                clearErrors('amount');
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                        <Controller
                                                            name="date"
                                                            control={control}
                                                            rules={{ required: true }}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    {...field}
                                                                    label='Fecha'
                                                                    variant="underlined"
                                                                    showMonthAndYearPickers
                                                                    isInvalid={errors.date ? true : false}
                                                                />
                                                            )}
                                                        />
                                                        <Button
                                                            color="primary"
                                                            radius="sm"
                                                            className="w-full md:w-auto"
                                                            isIconOnly
                                                            type="submit">
                                                            <PlusIcon className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                }
                                            </div>
                                        </CardHeader>
                                    </form>
                                    <CardBody>
                                        <Table
                                            aria-label="Payments Table"
                                            shadow="none"
                                            radius="sm">
                                            <TableHeader columns={columns}>
                                                {(column) => (
                                                    <TableColumn key={column.uid}>
                                                        {column.name}
                                                    </TableColumn>
                                                )}
                                            </TableHeader>
                                            <TableBody emptyContent={"No hubieron resultados"} items={installmentData.sort((a, b) => new Date(b.date) - new Date(a.date))}>
                                                {(item) => (
                                                    <TableRow key={item.id}>
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
                            </div>
                            <div className="w-full md:w-5/12 flex-grow">
                                <Card
                                    radius="sm"
                                    className="bg-card h-full"
                                    shadow="none">
                                    <form onSubmit={handleSubmitNote(onSubmitNote)}>
                                        <CardHeader>
                                            <div className="flex flex-col w-full">
                                                <div className="flex flex-row justify-between">
                                                    <h4 className="font-bold text-medium my-auto">Notas</h4>
                                                    <div className="flex gap-2">
                                                        {noteID.length > 0 &&
                                                            <>
                                                                <Button
                                                                    isIconOnly
                                                                    variant="light"
                                                                    color="danger"
                                                                    radius="sm"
                                                                    size="sm"
                                                                    onClick={async () => {
                                                                        await sweetAlert('¿Desea eliminar la nota?', '', 'warning', 'success', 'Nota Eliminada');
                                                                        await deleteNote(noteID)
                                                                            .then(() => {
                                                                                loadData();
                                                                                resetNote({ name: '', content: '', object_id: parseInt(param.id), content_type: 11 });
                                                                                setNoteID('');
                                                                            })
                                                                            .catch((error) => {
                                                                                console.error('Error: ', error);
                                                                            })
                                                                    }}>
                                                                    <TrashIcon className="w-5 h-5" />
                                                                </Button>
                                                                <Button
                                                                    isIconOnly
                                                                    variant="light"
                                                                    color="primary"
                                                                    radius="sm"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        resetNote({ name: '', content: '', object_id: parseInt(param.id), content_type: 11 });
                                                                        setNoteID('');
                                                                    }}>
                                                                    <ArrowPathIcon className="w-5 h-5" />
                                                                </Button>
                                                            </>
                                                        }
                                                        {!noteID.length > 0 &&
                                                            <Button
                                                                isIconOnly
                                                                color="primary"
                                                                variant="light"
                                                                radius="sm"
                                                                size="sm"
                                                                type="submit">
                                                                <PlusIcon className="w-5 h-5" />
                                                            </Button>
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    <Controller
                                                        name="name"
                                                        control={controlNote}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                label='Nombre'
                                                                variant="underlined"
                                                                isInvalid={errorsNote.name ? true : false}
                                                                isReadOnly={noteID.length > 0}
                                                            />
                                                        )}
                                                    />
                                                    <Controller
                                                        name="content"
                                                        control={controlNote}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <Textarea
                                                                {...field}
                                                                label="Nota"
                                                                placeholder="Escribe aquí . . ."
                                                                variant="underlined"
                                                                minRows={5}
                                                                maxRows={5}
                                                                maxLength={256}
                                                                isInvalid={errorsNote.content ? true : false}
                                                                isReadOnly={noteID.length > 0}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </form>
                                    <CardBody className="gap-2">
                                        <Table
                                            aria-label="Notes Table"
                                            hideHeader
                                            radius="sm"
                                            shadow="none"
                                            selectionMode="single"
                                            onRowAction={async (key) => {
                                                resetNote(...(await getNote('sale', param.id, key)).data);
                                                setNoteID(key);
                                            }}>
                                            <TableHeader>
                                                <TableColumn></TableColumn>
                                            </TableHeader>
                                            <TableBody emptyContent={"No se encontraron notas"}>
                                                {notes.map((note) =>
                                                    <TableRow key={note.id} className="cursor-pointer">
                                                        {() => <TableCell>{note.name}</TableCell>}
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}