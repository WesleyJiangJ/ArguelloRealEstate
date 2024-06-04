import React from "react";
import { Card, CardHeader, CardBody, Button, Input } from "@nextui-org/react";

export default function Detail() {
    return (
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
                                            value={'John Doe'}
                                        />
                                        <Input
                                            variant="underlined"
                                            isReadOnly
                                            label="Fecha de Nacimiento"
                                            value={'29/02/96'}
                                        />
                                    </div>
                                    <Input
                                        variant="underlined"
                                        isReadOnly
                                        label="Cédula"
                                        value={'001-290296-0090P'}
                                    />
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <Input
                                            variant="underlined"
                                            isReadOnly
                                            label="Celular"
                                            value={'+505 87656789'}
                                        />
                                        <Input
                                            variant="underlined"
                                            isReadOnly
                                            label="Correo"
                                            value={'johndoea@mail.com'}
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
                            <CardBody className="content-stretch gap-2">
                                <Button
                                    color="primary"
                                    radius="sm"
                                    className="h-full">
                                    Modificar
                                </Button>
                                <Button
                                    color="success"
                                    radius="sm"
                                    variant="light"
                                    className="h-full"
                                    onClick={() => window.open("https://wa.me/" + `${'here'}`, "_blank")}
                                    startContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                        </svg>}>
                                    Enviar Mensaje
                                </Button>
                                <Button
                                    color="danger"
                                    radius="sm"
                                    variant="light"
                                    className="h-full">
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
    );
}