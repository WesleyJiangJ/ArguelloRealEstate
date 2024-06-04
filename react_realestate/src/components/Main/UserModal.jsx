import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DatePicker } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form"
import { getLocalTimeZone, today } from "@internationalized/date";
import { postCustomer } from "../../api/apiFunctions";

export default function UserModal({ isOpen, onOpenChange, updateTable }) {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            first_name: '',
            middle_name: '',
            first_surname: '',
            second_surname: '',
            birthdate: today(),
            dni: '',
            phone_number: '',
            email: '',
            status: true
        }
    });
    const onSubmit = async (data) => {
        data.birthdate = data.birthdate.year + '-' + String(data.birthdate.month).padStart(2, '0') + '-' + String(data.birthdate.day).padStart(2, '0')
        await postCustomer(data)
            .then(() => {
                updateTable();
                onOpenChange(false);
                reset();
            })
            .catch((error) => {
                console.error('Error: ', error);
            })
    }
    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                    onOpenChange(false);
                    reset();
                }}
                radius="sm"
                size="4xl"
                backdrop="blur"
                placement="center"
                isDismissable={false}
                isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ModalHeader className="flex flex-col gap-1">Nuevo Cliente</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Controller
                                                name="first_name"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    validate: value => !value.includes(' ')
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label='Primer Nombre'
                                                        variant="underlined"
                                                        isInvalid={errors.first_name ? true : false}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="middle_name"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label='Segundo Nombre'
                                                        variant="underlined"
                                                        isInvalid={errors.middle_name ? true : false}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Controller
                                                name="first_surname"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    validate: value => !value.includes(' ')
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label='Primer Apellido'
                                                        variant="underlined"
                                                        isInvalid={errors.first_surname ? true : false}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="second_surname"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    validate: value => !value.includes(' ')
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label='Segundo Apellido'
                                                        variant="underlined"
                                                        isInvalid={errors.second_surname ? true : false}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <Controller
                                            name="birthdate"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <DatePicker
                                                    {...field}
                                                    label='Fecha de Nacimiento'
                                                    variant="underlined"
                                                    showMonthAndYearPickers
                                                    maxValue={today(getLocalTimeZone())}
                                                    errorMessage=' '
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="dni"
                                            control={control}
                                            rules={{
                                                required: true,
                                                pattern: {
                                                    value: /^\d{3}-(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])\d{2}-\d{4}[A-Z]$/
                                                }
                                            }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    label='Cédula'
                                                    placeholder="000-000000-0000A"
                                                    variant="underlined"
                                                    maxLength={16}
                                                    isInvalid={errors.dni ? true : false}
                                                />
                                            )}
                                        />
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Controller
                                                name="phone_number"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    minLength: 8,
                                                    maxLength: 8,
                                                    pattern: {
                                                        value: /^\d{8}$/
                                                    }
                                                }}
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <Input
                                                        value={value}
                                                        label='Celular'
                                                        variant="underlined"
                                                        maxLength={8}
                                                        isInvalid={errors.phone_number ? true : false}
                                                        onChange={(e) => {
                                                            const filteredValue = e.target.value.replace(/\D/g, '');
                                                            onChange(filteredValue);
                                                        }}
                                                        onBlur={onBlur}
                                                        ref={ref}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="email"
                                                control={control}
                                                rules={{
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label='Correo'
                                                        variant="underlined"
                                                        type="email"
                                                        isInvalid={errors.email ? true : false}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" radius="sm" onPress={onClose}>
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
        </>
    );
}