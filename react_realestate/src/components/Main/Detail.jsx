import React from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form"
import { Card, CardHeader, CardBody, Button, Input, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure } from "@nextui-org/react";
import { getSpecificCustomer, putCustomer, postNote, getNotes, getNote, deleteNote } from "../../api/apiFunctions"
import { ChatBubbleOvalLeftEllipsisIcon, PlusIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline"
import { sweetAlert, sweetToast } from "./Alert";
import UserModal from "./UserModal"

export default function Detail() {
    const param = useParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [customerData, setCustomerData] = React.useState([]);
    const [customerNotes, setCustomerNotes] = React.useState([]);
    const [customerNoteID, setCustomerNoteID] = React.useState('');
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
            content: '',
            object_id: parseInt(param.id),
            content_type: 7
        }
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setCustomerData((await getSpecificCustomer(param.id)).data);
        setCustomerNotes((await getNotes(param.id)).data);
    }

    const disableCustomer = async () => {
        if (customerData.status) customerData.status = false
        else customerData.status = true

        await sweetAlert(`¿Desea dar de ${customerData.status ? "alta" : "baja"} al cliente?`, '', "warning", "success", "Hecho");
        await putCustomer(param.id, customerData)
            .then(() => {
                loadData();
            })
            .catch((error) => {
                console.error('Error: ', error);
            })
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
            <div className="overflow-scroll h-full">
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex flex-col md:flex-row gap-2 h-full md:h-1/3">
                        <div className="w-full">
                            <Card
                                radius="sm"
                                className="bg-card h-full"
                                shadow="none">
                                <CardHeader>
                                    <h4 className="font-bold text-medium">Información del Cliente</h4>
                                </CardHeader>
                                <CardBody className="flex flex-col justify-center h-full">
                                    <div className="flex-1 flex flex-col justify-evenly">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Input
                                                variant="underlined"
                                                isReadOnly
                                                label='Nombre Completo'
                                                value={`${customerData.first_name} ${customerData.middle_name} ${customerData.first_surname} ${customerData.second_surname}`}
                                            />
                                            <Input
                                                variant="underlined"
                                                isReadOnly
                                                label="Fecha de Nacimiento"
                                                value={`${customerData.birthdate}`}
                                            />
                                        </div>
                                        <Input
                                            variant="underlined"
                                            isReadOnly
                                            label="Cédula"
                                            value={`${customerData.dni}`}
                                        />
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Input
                                                variant="underlined"
                                                isReadOnly
                                                label="Celular"
                                                value={`+505 ${customerData.phone_number}`}
                                            />
                                            <Input
                                                variant="underlined"
                                                isReadOnly
                                                label="Correo"
                                                value={`${customerData.email}`}
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
                                        onClick={onOpen}>
                                        Modificar
                                    </Button>
                                    <Button
                                        color="success"
                                        radius="sm"
                                        variant="light"
                                        className="h-16 m:h-full lg:h-full"
                                        onClick={() => window.open("https://wa.me/" + `${customerData.phone_number}`, "_blank")}
                                        startContent={<ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />}>
                                        Enviar Mensaje
                                    </Button>
                                    <Button
                                        color={`${customerData.status ? 'danger' : 'success'}`}
                                        radius="sm"
                                        variant="light"
                                        className="h-16 m:h-full lg:h-full"
                                        onClick={() => disableCustomer()}>
                                        Dar de {`${customerData.status ? 'Baja' : 'Alta'}`}
                                    </Button>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 flex-grow">
                        <div className="w-full flex-grow">
                            <Card
                                radius="sm"
                                className="bg-card h-full"
                                shadow="none">
                                <CardHeader>
                                    <h4 className="font-bold text-medium"></h4>
                                </CardHeader>
                                <CardBody></CardBody>
                            </Card>
                        </div>
                        <div className="w-full md:w-5/12 flex-grow">
                            <Card
                                radius="sm"
                                className="bg-card h-full"
                                shadow="none">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <CardHeader className="flex flex-row justify-between">
                                        <h4 className="font-bold text-medium">Notas</h4>
                                        <div className="flex gap-2">
                                            {customerNoteID.length > 0 &&
                                                <>
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        color="danger"
                                                        radius="sm"
                                                        size="sm"
                                                        onClick={async () => {
                                                            await sweetAlert('¿Desea eliminar la nota?', '', 'warning', 'success', 'Nota Eliminada');
                                                            await deleteNote(customerNoteID)
                                                                .then(() => {
                                                                    loadData();
                                                                    reset({ name: '', content: '', object_id: parseInt(param.id), content_type: 7 });
                                                                    setCustomerData('');
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
                                                            reset({ name: '', content: '', object_id: parseInt(param.id), content_type: 7 });
                                                            setCustomerNoteID('');
                                                        }}>
                                                        <ArrowPathIcon className="w-5 h-5" />
                                                    </Button>
                                                </>
                                            }
                                            {!customerNoteID.length > 0 &&
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
                                    </CardHeader>
                                    <CardBody className="gap-2">
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
                                                    isReadOnly={customerNoteID.length > 0}
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
                                                    isReadOnly={customerNoteID.length > 0}
                                                />
                                            )}
                                        />
                                        <Table
                                            aria-label="Notes Table"
                                            hideHeader
                                            radius="sm"
                                            shadow="none"
                                            selectionMode="single"
                                            onRowAction={async (key) => {
                                                reset(...(await getNote(param.id, key)).data);
                                                setCustomerNoteID(key);
                                            }}>
                                            <TableHeader>
                                                <TableColumn></TableColumn>
                                            </TableHeader>
                                            <TableBody emptyContent={"No se encontraron notas"}>
                                                {customerNotes.map((note) =>
                                                    <TableRow key={note.id} className="cursor-pointer">
                                                        {() => <TableCell>{note.name}</TableCell>}
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardBody>
                                </form>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <UserModal isOpen={isOpen} onOpenChange={onOpenChange} reloadData={loadData} />
        </>
    );
}