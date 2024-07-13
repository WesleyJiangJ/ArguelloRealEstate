import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Autocomplete, AutocompleteItem, Select, SelectItem } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form"
import { useParams, useNavigate } from "react-router-dom";
import { getAllCustomers, getAllPersonal, getAllPlots, patchPlot, postSale } from "../../api/apiFunctions";
import { sweetAlert } from "./Alert";

export default function SalesModal({ isOpen, onOpenChange, updateTable }) {
    const param = useParams();
    const navigate = useNavigate();
    const [customerData, setCustomerData] = React.useState([]);
    const [personalData, setPersonalData] = React.useState([]);
    const [plotData, setPlotData] = React.useState([]);
    const [eachInstallment, setEachInstallment] = React.useState('');
    const { control, handleSubmit, formState: { errors }, reset, watch, setValue, setError, clearErrors } = useForm({
        defaultValues: {
            id_customer: '',
            id_personal: '',
            id_plot: '',
            price: '',
            premium: '',
            sale_commission: '',
            penalty_commission: '',
            debt: '',
            installments: '',
        }
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setCustomerData((await getAllCustomers()).data.filter((data) => data.status === true));
        setPersonalData((await getAllPersonal()).data.filter((data) => data.status === true));
        setPlotData((await getAllPlots()).data.filter((plot) => plot.status === 0));
    }

    const onSubmit = async (data) => {
        await sweetAlert('¿Crear esta venta?', 'Una vez creada, no podrás modificarla', 'question', 'success', 'Hecho');
        await postSale(data)
            .then(async (response) => {
                await patchPlot(data.id_plot, { status: 1 })
                    .catch(error => console.log(error));
                updateTable();
                onOpenChange(false);
                navigate(`detail/${response.data.id}`);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={() => {
                    onOpenChange(false);
                    reset();
                    setEachInstallment(0);
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
                                                            setValue('price', plotData.find(plot => plot.id === parseInt(e.target.value)).price);
                                                            setValue('premium', '');
                                                            setValue('debt', '');
                                                            setValue('installments', '');
                                                            setEachInstallment('');
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
                                                        if (parseFloat(value) > parseFloat(watch('price'))) {
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
                                                        isReadOnly={watch('price') === ''}
                                                        isInvalid={errors.premium ? true : false}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value);
                                                            if (value !== '') {
                                                                setValue('debt', '');
                                                                setValue('installments', '');
                                                                setEachInstallment('');
                                                            }
                                                            if (value.length === 0) {
                                                                setValue('debt', '');
                                                                setValue('installments', '');
                                                                setEachInstallment('');
                                                            }
                                                            else if (value < 0) {
                                                                setError('premium');
                                                                setValue('debt', '');
                                                                setValue('installments', '');
                                                                setEachInstallment('');
                                                            }
                                                            else {
                                                                if (parseFloat(value) > parseFloat(watch('price'))) {
                                                                    setError('premium');
                                                                    setValue('debt', '');
                                                                }
                                                                else {
                                                                    setValue('debt', parseFloat(watch('price')) - parseFloat(value));
                                                                    clearErrors('premium');
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="debt"
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
                                                placeholder="0.00"
                                                isReadOnly
                                                value={watch('price')}
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <Controller
                                                name="installments"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    validate: value => {
                                                        if (parseInt(value) < 0) {
                                                            return 'The installments cannot be negative';
                                                        }
                                                        return true;
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label={'Cantidad de Cuotas'}
                                                        variant="underlined"
                                                        maxLength={6}
                                                        isReadOnly={watch('premium') === '' || watch('premium') < 0}
                                                        isInvalid={errors.installments ? true : false}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            if (parseInt(e.target.value) < 0) {
                                                                setError('installments');
                                                                setEachInstallment('');
                                                            }
                                                            else {
                                                                setEachInstallment(parseFloat(watch('debt')) / parseFloat(e.target.value));
                                                                clearErrors('installments');
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                            <Input
                                                label={'Cuotas Mensuales'}
                                                variant="underlined"
                                                placeholder="0.00"
                                                value={eachInstallment > 0 ? parseFloat(eachInstallment).toFixed(2) : ''}
                                                isReadOnly
                                                startContent={'$'}
                                            />
                                            <Controller
                                                name="sale_commission"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    validate: value => {
                                                        if (parseInt(value) < 0) {
                                                            return 'The sale commision cannot be negative';
                                                        }
                                                        return true;
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label={'Comisión de Venta'}
                                                        variant="underlined"
                                                        placeholder="0.00"
                                                        endContent={'%'}
                                                        maxLength={6}
                                                        isInvalid={errors.sale_commission ? true : false}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            if (parseInt(e.target.value) < 0) {
                                                                setError('sale_commission');
                                                            }
                                                            else {
                                                                clearErrors('sale_commission');
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="penalty_commission"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    validate: value => {
                                                        if (parseInt(value) < 0) {
                                                            return 'The penalty commision cannot be negative';
                                                        }
                                                        return true;
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        label={'Interés Moratorio'}
                                                        variant="underlined"
                                                        placeholder="0.00"
                                                        endContent={'%'}
                                                        maxLength={6}
                                                        isInvalid={errors.penalty_commission ? true : false}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            if (parseInt(e.target.value) < 0) {
                                                                setError('penalty_commission');
                                                            }
                                                            else {
                                                                clearErrors('penalty_commission');
                                                            }
                                                        }}
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