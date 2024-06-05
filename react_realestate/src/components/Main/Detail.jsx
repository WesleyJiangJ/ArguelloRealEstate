import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, Button, Input, useDisclosure } from "@nextui-org/react";
import { getSpecificCustomer } from "../../api/apiFunctions"
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"
import UserModal from "./UserModal"

export default function Detail() {
    const param = useParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [customerData, setCustomerData] = React.useState([]);

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setCustomerData((await getSpecificCustomer(param.id)).data);
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
                                        color="danger"
                                        radius="sm"
                                        variant="light"
                                        className="h-16 m:h-full lg:h-full">
                                        Dar de Baja
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
                                <CardHeader>
                                    <h4 className="font-bold text-medium">Notas</h4>
                                </CardHeader>
                                <CardBody></CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <UserModal isOpen={isOpen} onOpenChange={onOpenChange} reloadData={loadData} />
        </>
    );
}