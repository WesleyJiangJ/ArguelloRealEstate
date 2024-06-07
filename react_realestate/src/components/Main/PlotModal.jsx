import React from "react";
import { useForm, Controller } from "react-hook-form"
import { Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { getSpecificPlot, postPlot, putPlot, postNote, getNote, putNote, deleteNote } from "../../api/apiFunctions";
import { sweetAlert, sweetToast } from "./Alert";

export default function PlotModal({ isOpen, onOpenChange, loadPlot, param, modifyURL }) {
    const { control, handleSubmit, formState: { errors }, reset, setError, watch } = useForm({
        defaultValues: {
            id: '',
            number: '',
            price: '',
            notes: {
                id: '',
                content: '',
                content_type: 10,
                object_id: ''
            },
            status: 0
        }
    });
    const [prevData, setPrevData] = React.useState({});
    const isReadOnly = watch('status') === 1 || watch('status') === 2;

    React.useEffect(() => {
        loadData();
    }, [param.id])

    const loadData = async () => {
        if (param.id) {
            const res = (await getSpecificPlot(param.id)).data;
            const resNote = (await getNote('plot', param.id, '')).data;

            // Check if resNotes has values
            const note = resNote && resNote.length > 0
                ? resNote[0]
                : { id: '', content: '', content_type: 10, object_id: '' };

            reset({
                ...res,
                notes: {
                    id: note.id,
                    content: note.content,
                    content_type: note.content_type,
                    object_id: note.object_id
                }
            });
            setPrevData({
                ...res,
                notes: {
                    id: note.id,
                    content: note.content,
                    content_type: note.content_type,
                    object_id: note.object_id
                }
            });
        }
    }

    const restore = () => {
        loadPlot();
        reset({
            id: '',
            number: '',
            price: '',
            notes: {
                id: '',
                content: '',
                content_type: 10,
                object_id: ''
            },
            status: 0
        });
        onOpenChange(false);
        modifyURL();
    }

    const onSubmit = async (data) => {
        try {
            if (param.id) {
                /*
                    Check if the user has changed anything
                */
                let change = [];
                for (const key in prevData) {
                    if (prevData[key] !== data[key]) {
                        if (key === 'number') {
                            change.push("numero de lote");
                        }
                        else if (key === 'price') {
                            change.push("precio");
                        }
                        else if (prevData[key].content !== data[key].content) {
                            change.push("nota");
                        }
                    }
                }
                if (change.length > 0) {
                    /*
                        - If there's a change, we update the plot information, if not, display a toast message saying "There ins't any change".
                        - Checks if a note exists, if not, we create a new one.
                        - If a note exists, we update it.
                        - Check if the plot exists, if it exists, display a toast showing a message.
                        - If note content is removed and the user saves the changes, the note record will be deleted.
                    */
                    await sweetAlert('¿Estás seguro?', `¿Deseas modificar ${change.join(', ')}?`, 'warning', 'success', 'Actualizado');
                    await putPlot(param.id, data)
                        .then(async () => {
                            const res = (await getNote('plot', param.id, '')).data;
                            if (res.length === 0 && data.notes.content.length !== 0) {
                                data.notes.object_id = param.id;
                                await postNote(data.notes)
                                    .then(() => {
                                        restore();
                                    })
                                    .catch((error) => console.error('Error:', error));
                            }
                            else {
                                if (data.notes.content.length !== 0) {
                                    await putNote(data.notes.id, data.notes)
                                        .catch((error) => console.log(error))
                                }
                                else if (data.notes.id) {
                                    await deleteNote(data.notes.id)
                                        .catch((error) => console.log(error))
                                }
                            }
                            sweetToast("success", `Se actualizó ${data.number}`);
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
                    onOpenChange(false);
                }
            }
            else {
                /*
                    - Post a new plot.
                    - If "notes.content" has values, create a new one, if not, it doesn't.
                */
                await postPlot(data)
                    .then(async (response) => {
                        if (watch('notes.content').length > 0) {
                            if (response.status === 201) {
                                data.notes.object_id = response.data.id;
                                data.notes.content_type = 10;
                                await postNote(data.notes)
                                    .then(() => {
                                        sweetToast("success", `Se agregó ${data.number}`);
                                        restore();
                                    })
                                    .catch((error) => console.error('Error:', error));
                            } else {
                                console.error('Error:', response);
                            }
                        }
                        else {
                            sweetToast("success", `Se agregó ${data.number}`);
                            restore();
                        }
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
                                            isReadOnly={isReadOnly ? true : false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{ required: true, maxLength: 11 }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="0.00"
                                            errorMessage={" "}
                                            label="Precio"
                                            variant="underlined"
                                            startContent={'$'}
                                            maxLength={11}
                                            isInvalid={errors.price ? true : false}
                                            isReadOnly={isReadOnly ? true : false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="notes.content"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            label="Nota"
                                            placeholder="Escribe aquí . . ."
                                            variant="underlined"
                                            minRows={3}
                                            maxRows={3}
                                            maxLength={256}
                                            isInvalid={errors.content ? true : false}
                                            isReadOnly={isReadOnly ? true : false}
                                        />
                                    )}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" radius="sm" onClick={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" radius="sm" type="submit" isDisabled={isReadOnly ? true : false} className={isReadOnly ? 'hidden' : 'flex'}>
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