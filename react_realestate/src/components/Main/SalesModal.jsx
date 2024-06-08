import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Autocomplete, AutocompleteItem, Select, SelectItem } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form"
import { useParams } from "react-router-dom";
import { getAllCustomers, getAllPersonal, getAllPlots } from "../../api/apiFunctions";
import { sweetAlert, sweetToast } from "./Alert";

export default function SalesModal({ isOpen, onOpenChange, updateTable, reloadData }) {
    const param = useParams();
    const [customerData, setCustomerData] = React.useState([]);
    const [personalData, setPersonalData] = React.useState([]);
    const [plotData, setPlotData] = React.useState([]);
    const [plotPrice, setPlotPrice] = React.useState(0);
    const { control, handleSubmit, formState: { errors }, reset, watch, setValue, setError, clearErrors } = useForm({
        defaultValues: {
            id_customer: '',
            id_personal: '',
            id_plot: '',
            premium: '',
            total: ''
        }
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setCustomerData((await getAllCustomers()).data);
        setPersonalData((await getAllPersonal()).data);
        setPlotData((await getAllPlots()).data.filter((plot) => plot.status === 0));
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
                                <ModalHeader className="flex flex-col gap-1">{param.id ? 'Modificar' : 'Agregar'} Venta</ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Controller
                                                name="id_customer"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        label="Cliente"
                                                        defaultItems={customerData}
                                                        variant="underlined"
                                                        onSelectionChange={value => field.onChange({ target: { value } })}
                                                        onBlur={field.onBlur}
                                                        isInvalid={errors.id_customer ? true : false}>
                                                        {(data) => <AutocompleteItem key={data.id} value={data.id} textValue={`${data.first_name} ${data.middle_name} ${data.first_surname} ${data.second_surname}`}>{`${data.first_name} ${data.middle_name} ${data.first_surname} ${data.second_surname}`}</AutocompleteItem>}
                                                    </Autocomplete>
                                                )}
                                            />
                                            <Controller
                                                name="id_personal"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        label="Personal"
                                                        defaultItems={personalData}
                                                        variant="underlined"
                                                        onSelectionChange={value => field.onChange({ target: { value } })}
                                                        onBlur={field.onBlur}
                                                        isInvalid={errors.id_personal ? true : false}>
                                                        {(data) => <AutocompleteItem key={data.id} value={data.id} textValue={`${data.first_name} ${data.middle_name} ${data.first_surname} ${data.second_surname}`}>{`${data.first_name} ${data.middle_name} ${data.first_surname} ${data.second_surname}`}</AutocompleteItem>}
                                                    </Autocomplete>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Controller
                                                name="id_plot"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        items={plotData}
                                                        label="Lote"
                                                        variant="underlined"
                                                        disallowEmptySelection
                                                        isInvalid={errors.id_plot ? true : false}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setPlotPrice(plotData.find(plot => plot.id === parseInt(e.target.value)).price);
                                                            setValue('premium', '');
                                                            setValue('total', '');
                                                        }}>
                                                        {(data) => <SelectItem description={`$${data.price}`}>{data.number}</SelectItem>}
                                                    </Select>
                                                )}
                                            />
                                            <Controller
                                                name="premium"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    validate: value => {
                                                        if (parseFloat(value) > parseFloat(plotPrice)) {
                                                            return 'The premium cannot be higher than the price of the plot';
                                                        }
                                                        return true;
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label={'Prima'}
                                                        variant="underlined"
                                                        startContent={'$'}
                                                        type="number"
                                                        placeholder="0.00"
                                                        min={1}
                                                        isReadOnly={plotPrice === 0}
                                                        isInvalid={errors.premium ? true : false}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            const premium = watch('premium');
                                                            if (premium.length === 0) {
                                                                setValue('total', 0);
                                                            }
                                                            else if (premium < 0) {
                                                                setError('premium');
                                                                setValue('total', 0);
                                                            }
                                                            else {
                                                                if (parseFloat(premium) > parseFloat(plotPrice)) {
                                                                    setError('premium');
                                                                    setValue('total', 0);
                                                                }
                                                                else {
                                                                    setValue('total', parseFloat(plotPrice) - parseFloat(premium));
                                                                    clearErrors('premium');
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="total"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label={'Deuda'}
                                                        variant="underlined"
                                                        startContent={'$'}
                                                        placeholder="0.00"
                                                        isReadOnly
                                                    />
                                                )}
                                            />
                                            <Input
                                                label={'Precio del Lote'}
                                                variant="underlined"
                                                startContent={'$'}
                                                isReadOnly
                                                value={plotPrice}
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