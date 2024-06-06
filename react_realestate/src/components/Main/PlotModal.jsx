import React from "react";
import { useForm, Controller } from "react-hook-form"
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { getSpecificPlot, postPlot, putPlot } from "../../api/apiFunctions";
import { sweetAlert, sweetToast } from "./Alert";

export default function PlotModal({ isOpen, onOpenChange, loadPlot, param, modifyURL }) {
    const { control, handleSubmit, formState: { errors }, reset, setError } = useForm({
        defaultValues: {
            number: '',
            price: ''
        }
    });
    const [prevData, setPrevData] = React.useState({});

    React.useEffect(() => {
        loadData();
    }, [param.id])

    const loadData = async () => {
        if (param.id) {
            const res = (await getSpecificPlot(param.id)).data;
            reset({ ...res });
            setPrevData({ ...res });
        }
    }

    const restore = () => {
        loadPlot();
        reset({ number: '', price: '' });
        onOpenChange(false);
        modifyURL();
    }

    const onSubmit = async (data) => {
        try {
            if (param.id) {
                let change = [];
                for (const key in prevData) {
                    if (prevData[key] !== data[key]) {
                        if (key === 'number') {
                            change.push("numero de lote");
                        }
                        else if (key === 'price') {
                            change.push("precio");
                        }
                    }
                }
                if (change.length > 0) {
                    await sweetAlert('¿Estás seguro?', `¿Deseas modificar ${change.join(', ')}?`, 'warning', 'success', 'Actualizado');
                    await putPlot(param.id, data)
                        .then(() => {
                            sweetToast("success", `Se agregó ${data.number}`);
                            restore();
                        })
                        .catch((error) => {
                            if (error.response.status === 400 && error.response.data.number[0] === 'Ya existe plot con este number.') {
                                sweetToast("error", `El lote N°${data.number} ya existe`);
                                setError("number");
                            }
                            else {
                                console.error('Error:', error);
                            }

                        });
                }
                else {
                    sweetToast('warning', 'No se realizaron modificaciones');
                }
            }
            else {
                await postPlot(data)
                    .then(() => {
                        sweetToast("success", `Se agregó ${data.number}`);
                        restore();
                    })
                    .catch((error) => {
                        if (error.response.status === 400 && error.response.data.number[0] === 'Ya existe plot con este number.') {
                            sweetToast("error", `El lote N°${data.number} ya existe`);
                            setError("number");
                        }
                        else {
                            console.error('Error:', error);
                        }

                    });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={() => {
                onOpenChange(true);
                reset({ number: '', price: '' });
                modifyURL();
            }}
            radius="sm"
            backdrop="blur"
            isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader className="flex flex-col gap-1">{param.id ? 'Modificar' : 'Nuevo'} Lote</ModalHeader>
                            <ModalBody>
                                <Controller
                                    name="number"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Lote"
                                            variant="underlined"
                                            autoFocus
                                            startContent={'N°'}
                                            isInvalid={errors.number ? true : false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="0.00"
                                            errorMessage={" "}
                                            label="Precio"
                                            variant="underlined"
                                            startContent={'$'}
                                            isInvalid={errors.price ? true : false}
                                        />
                                    )}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" radius="sm" onClick={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" radius="sm" type="submit">
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}