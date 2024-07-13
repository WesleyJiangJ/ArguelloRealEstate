import React from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form"
import { Card, CardHeader, CardBody, Button, Input, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tab, Tabs, Spinner, useDisclosure } from "@nextui-org/react";
import { getSpecificCustomer, patchCustomer, postNote, getNotes, getNote, deleteNote, getSpecificPersonal, patchPersonal, getSaleByUser, getCommissionByUser, patchUser, getUser } from "../../api/apiFunctions"
import { ChatBubbleOvalLeftEllipsisIcon, PlusIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline"
import { sweetAlert, sweetToast } from "./Alert";
import UserModal from "./UserModal"
import Cards from "./Cards";

export default function Detail({ value }) {
    const param = useParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = React.useState(true);
    const [userData, setUserData] = React.useState([]);
    const [notes, setNotes] = React.useState([]);
    const [noteID, setNoteID] = React.useState('');
    const [sale, setSale] = React.useState([]);
    const [commission, setCommission] = React.useState([]);
    const [totalCommission, setTotalCommission] = React.useState(0);
    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            name: '',
            content: '',
            object_id: parseInt(param.id),
            content_type: ''
        }
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (value === "Clientes") {
            setUserData((await getSpecificCustomer(param.id)).data);
            setNotes((await getNotes('customer', param.id)).data);
            setSale((await getSaleByUser(param.id, '')).data);
            setValue('content_type', 7);
            setIsLoading(false);
        }
        else {
            setUserData((await getSpecificPersonal(param.id)).data);
            setNotes((await getNotes('personal', param.id)).data);
            setSale((await getSaleByUser('', param.id)).data);
            const commissions = (await getCommissionByUser(param.id)).data;
            setCommission(commissions);
            setTotalCommission(commissions.reduce((total, item) => total + parseFloat(item.amount), 0));
            setValue('content_type', 10);
            setIsLoading(false);
        }
    }

    const disableUser = async () => {
        const update_data = {}
        if (userData.status) update_data.status = false
        else update_data.status = true

        if (sale.filter(info => info.status === 0).length > 0) {
            sweetToast('error', `No puede dar de baja al ${value === 'Cliente' ? 'cliente' : 'personal'} porque tiene ventas activas`)
        }
        else {
            await sweetAlert(`¿Desea dar de ${update_data.status ? "alta" : "baja"} al ${value === 'Clientes' ? 'cliente' : 'personal'}?`, '', "warning", "success", "Hecho");
            if (value === 'Clientes') {
                if (sale.filter(data => data.status === 0)) {
                    await patchCustomer(param.id, update_data)
                        .then(() => {
                            loadData();
                        })
                        .catch((error) => {
                            console.error('Error: ', error);
                        })
                }
            }
            else {
                await patchPersonal(param.id, update_data)
                    .then(async () => {
                        const res = (await getUser(userData.email)).data;
                        await patchUser(res[0].id, { is_active: update_data.status })
                        loadData();
                    })
                    .catch((error) => {
                        console.error('Error: ', error);
                    })
            }
        }
    }

    const onSubmit = async (data) => {
        sweetToast('success', 'Nota guardada');
        await postNote(data)
            .then(() => {
                loadData();
                reset();
            })
            .catch((error) => {
                console.error('Error: ', error);
            })
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
                                        <h4 className="font-bold text-medium">Información del {value === 'Clientes' ? 'Cliente' : 'Personal'}</h4>
                                    </CardHeader>
                                    <CardBody className="flex flex-col justify-center h-full">
                                        <div className="flex-1 flex flex-col justify-evenly">
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label='Nombre Completo'
                                                    value={`${userData.first_name} ${userData.middle_name} ${userData.first_surname} ${userData.second_surname}`}
                                                />
                                                <Input
                                                    variant="underlined"
                                                    isReadOnly
                                                    label="Fecha de Nacimiento"
                                                    value={`${userData.birthdate}`}
                                                />
                                            </div>
                                            <Input
                                                variant="underlined"
                                                isReadOnly
                                                label="Cédula"
                                                value={`${userData.dni}`}
                                            />
                                            <div className="flex flex-col md:flex-row gap-2">
                                                {userData.phone_number &&
                                                    <Input
                                                        variant="underlined"
                                                        isReadOnly
                                                        label="Celular"
                                                        value={`+505 ${userData.phone_number}`}
                                                    />
                                                }
                                                {userData.email &&
                                                    <Input
                                                        variant="underlined"
                                                        isReadOnly
                                                        label="Correo"
                                                        value={`${userData.email}`}
                                                    />
                                                }
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
                                            onClick={onOpen}>
                                            Modificar
                                        </Button>
                                        <Button
                                            color="success"
                                            radius="sm"
                                            variant="light"
                                            className="h-16 m:h-full lg:h-full"
                                            onClick={() => window.open("https://wa.me/" + `505${userData.phone_number}`, "_blank")}
                                            startContent={<ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />}>
                                            Enviar Mensaje
                                        </Button>
                                        <Button
                                            color={`${userData.status ? 'danger' : 'success'}`}
                                            radius="sm"
                                            variant="light"
                                            className="h-16 m:h-full lg:h-full"
                                            onClick={() => disableUser()}>
                                            Dar de {`${userData.status ? 'Baja' : 'Alta'}`}
                                        </Button>
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
                                    <CardHeader>
                                        <h4 className="font-bold text-medium">Detalle Ventas</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Tabs aria-label="Details" color="primary" fullWidth>
                                            <Tab
                                                key="process"
                                                title={
                                                    <div className="flex items-center space-x-2">
                                                        <span>Proceso →</span>
                                                        <div className="w-5 h-5 flex items-center justify-center">
                                                            <span>{sale.filter((info) => info.status === 0).length}</span>
                                                        </div>
                                                    </div>
                                                }>
                                                <Card
                                                    radius="sm"
                                                    shadow="none"
                                                    className="h-full">
                                                    <CardBody>
                                                        <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                            {sale
                                                                .filter(info => info.status === 0)
                                                                .sort((a, b) => new Date(a.modified_at) - new Date(b.modified_at))
                                                                .map((data) => (
                                                                    <div className="w-full md:w-1/2" key={data.id}>
                                                                        <Cards
                                                                            id={data.id}
                                                                            plot={`Lote ${data.plot_data.number}`}
                                                                            name={value === 'Clientes' ? `${data.personal_data.first_name} ${data.personal_data.middle_name} ${data.personal_data.first_surname} ${data.personal_data.second_surname}` : `${data.customer_data.first_name} ${data.customer_data.middle_name} ${data.customer_data.first_surname} ${data.customer_data.second_surname}`}
                                                                            plotPrice={`Precio: $${parseFloat(data.price).toLocaleString()}`}
                                                                            pending={`Pendiente: $${(parseFloat(data.price) - parseFloat(data.total_paid)).toLocaleString()}`}
                                                                            paid={`Abonado: $${parseFloat(data.total_paid).toLocaleString()}`}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                            {sale.filter(info => info.status === 0).length === 0 && (
                                                                <Card radius="sm" shadow="none" fullWidth>
                                                                    <CardBody className="flex items-center justify-center h-full">
                                                                        No se encontraron lotes en proceso de venta
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                            <Tab
                                                key="sold"
                                                title={<div className="flex items-center space-x-2">
                                                    <span>Vendidos →</span>
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <span>{sale.filter((info) => info.status === 1).length}</span>
                                                    </div>
                                                </div>}>
                                                <Card
                                                    radius="sm"
                                                    shadow="none"
                                                    className="h-full">
                                                    <CardBody>
                                                        <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                            {sale
                                                                .filter(info => info.status === 1)
                                                                .sort((a, b) => new Date(a.modified_at) - new Date(b.modified_at))
                                                                .map((data) => (
                                                                    <div className="w-full md:w-1/2" key={data.id}>
                                                                        <Cards
                                                                            id={data.id}
                                                                            plot={`Lote ${data.plot_data.number}`}
                                                                            name={value === 'Clientes' ? `${data.personal_data.first_name} ${data.personal_data.middle_name} ${data.personal_data.first_surname} ${data.personal_data.second_surname}` : `${data.customer_data.first_name} ${data.customer_data.middle_name} ${data.customer_data.first_surname} ${data.customer_data.second_surname}`}
                                                                            plotPrice={`Precio: $${parseFloat(data.price).toLocaleString()}`}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                            {sale.filter(info => info.status === 1).length === 0 && (
                                                                <Card radius="sm" shadow="none" fullWidth>
                                                                    <CardBody className="flex items-center justify-center h-full">
                                                                        No se encontraron lotes vendidos
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                            <Tab
                                                key="cancelled"
                                                title={
                                                    <div className="flex items-center space-x-2">
                                                        <span>Anulados →</span>
                                                        <div className="w-5 h-5 flex items-center justify-center">
                                                            <span>{sale.filter((info) => info.status === 2).length}</span>
                                                        </div>
                                                    </div>
                                                }>
                                                <Card
                                                    radius="sm"
                                                    shadow="none"
                                                    className="h-full">
                                                    <CardBody>
                                                        <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                            {sale
                                                                .filter(info => info.status === 2)
                                                                .sort((a, b) => new Date(a.modified_at) - new Date(b.modified_at))
                                                                .map((data) => (
                                                                    <div className="w-full md:w-1/2" key={data.id}>
                                                                        <Cards
                                                                            id={data.id}
                                                                            plot={`Lote ${data.plot_data.number}`}
                                                                            name={value === 'Clientes' ? `${data.personal_data.first_name} ${data.personal_data.middle_name} ${data.personal_data.first_surname} ${data.personal_data.second_surname}` : `${data.customer_data.first_name} ${data.customer_data.middle_name} ${data.customer_data.first_surname} ${data.customer_data.second_surname}`}
                                                                            plotPrice={`Precio: $${parseFloat(data.price).toLocaleString()}`}
                                                                            pending={`Pendiente: $${(parseFloat(data.price) - parseFloat(data.total_paid)).toLocaleString()}`}
                                                                            paid={`Abonado: $${parseFloat(data.total_paid).toLocaleString()}`}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                            {sale.filter(info => info.status === 2).length === 0 && (
                                                                <Card radius="sm" shadow="none" fullWidth>
                                                                    <CardBody className="flex items-center justify-center h-full">
                                                                        No se encontraron lotes con venta anulada
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                            {value === "Personal" &&
                                                <Tab
                                                    key="commission"
                                                    title={"Comisiones"}>
                                                    <Card
                                                        radius="sm"
                                                        shadow="none"
                                                        className="h-full">
                                                        <CardBody>
                                                            <Input variant="underlined" label={'Total'} startContent={'$'} isReadOnly value={parseFloat(totalCommission).toLocaleString()} />
                                                            <div className='flex flex-nowrap flex-col md:flex-wrap md:flex-row w-full h-full overflow-scroll'>
                                                                <Table
                                                                    aria-label="Commission Table"
                                                                    radius="sm"
                                                                    shadow="none"
                                                                    className="flex-grow overflow-auto">
                                                                    <TableHeader>
                                                                        <TableColumn>Lote</TableColumn>
                                                                        <TableColumn>Precio</TableColumn>
                                                                        <TableColumn>Comisión</TableColumn>
                                                                        <TableColumn>Total</TableColumn>
                                                                    </TableHeader>
                                                                    <TableBody emptyContent={"No hubieron resultados"}>
                                                                        {commission.map((row) =>
                                                                            <TableRow key={row.id}>
                                                                                <TableCell>{row.plot_data.number}</TableCell>
                                                                                <TableCell>${parseFloat(row.plot_data.price).toLocaleString()}</TableCell>
                                                                                <TableCell>{(parseFloat(row.amount) / parseFloat(row.plot_data.price) * 100)}%</TableCell>
                                                                                <TableCell>${row.amount}</TableCell>
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Tab>
                                            }
                                        </Tabs>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="w-full md:w-5/12 flex-grow">
                                <Card
                                    radius="sm"
                                    className="bg-card h-full"
                                    shadow="none">
                                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                                                                reset({ name: '', content: '', object_id: parseInt(param.id), content_type: value === 'customer' ? 7 : 10 });
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
                                                                        reset({ name: '', content: '', object_id: parseInt(param.id), content_type: value === 'customer' ? 7 : 10 });
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
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                label='Nombre'
                                                                variant="underlined"
                                                                isInvalid={errors.name ? true : false}
                                                                isReadOnly={noteID.length > 0}
                                                            />
                                                        )}
                                                    />
                                                    <Controller
                                                        name="content"
                                                        control={control}
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
                                                                isInvalid={errors.content ? true : false}
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
                                                reset(...(await getNote(value === 'Clientes' ? 'customer' : 'personal', param.id, key)).data);
                                                setNoteID(key);
                                            }}>
                                            <TableHeader>
                                                <TableColumn></TableColumn>
                                            </TableHeader>
                                            <TableBody emptyContent={"No se encontraron notas"}>
                                                {notes.map((note) =>
                                                    <TableRow key={note.id} className="cursor-pointer">
                                                        {() =>
                                                            <TableCell>
                                                                <div className="flex flex-col truncate max-w-sm md:max-w-md">
                                                                    <p className="text-bold text-sm capitalize">{note.name}</p>
                                                                    <p className="text-bold text-sm capitalize text-default-400">{note.content}</p>
                                                                </div>
                                                            </TableCell>
                                                        }
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
            <UserModal isOpen={isOpen} onOpenChange={onOpenChange} reloadData={loadData} value={value} />
        </>
    );
}