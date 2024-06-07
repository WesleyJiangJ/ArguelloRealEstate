import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form"
import { useParams } from "react-router-dom";
import { getAllCustomers } from "../../api/apiFunctions";
import { sweetAlert, sweetToast } from "./Alert";

export default function SalesModal({ isOpen, onOpenChange, updateTable, reloadData }) {
    const param = useParams();
    const [customerData, setCustomerData] = React.useState([]);
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            id_customer: ''
        }
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setCustomerData((await getAllCustomers()).data);
    }

    const onSubmit = async (data) => {
        console.log(data);
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
                                <ModalHeader className="flex flex-col gap-1">{param.id ? 'Modificar' : 'Nueva'} Venta</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Controller
                                                name="id_customer"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    validate: value => !value.includes(' ')
                                                }}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        label="Cliente"
                                                        variant="underlined">
                                                        {customerData.map((customer) => (
                                                            <AutocompleteItem key={customer.id} value={customer.id} textValue={`${customer.first_name} ${customer.middle_name} ${customer.first_surname} ${customer.second_surname}`}>
                                                                {`${customer.first_name} ${customer.middle_name} ${customer.first_surname} ${customer.second_surname}`}
                                                            </AutocompleteItem>
                                                        ))}
                                                    </Autocomplete>
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