import React from "react";
import { useForm, Controller } from "react-hook-form"
import { Tabs, Tab, Card, CardBody, Input, Select, SelectItem, Button } from "@nextui-org/react";
import { sweetAlert, sweetToast } from "./Alert";
import { getPDFInformation, patchPDFInformation } from "../../api/apiFunctions";

export default function Settings() {
    const [prevData, setPrevData] = React.useState({});
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
            bank_account: '',
            phone_number_one: '',
            phone_number_one_company: 0,
            phone_number_two: '',
            phone_number_two_company: 0
        }
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = (await getPDFInformation(1)).data;
        reset({ ...res });
        setPrevData({ ...res });
    }

    const onSubmit = async (data) => {
        let changes = new Set();
        for (const key in prevData) {
            if (prevData[key] !== data[key]) {
                if (key === "name") {
                    changes.add("nombre");
                }
                else if (key === "bank_account") {
                    changes.add("número de cuenta");
                }
                else if (key === 'phone_number_one') {
                    changes.add("número de celular");
                }
                else if (key === 'phone_number_one_company') {
                    changes.add("compañía telefónica");
                }
                else if (key === 'phone_number_two') {
                    changes.add("número de celular");
                }
                else if (key === 'phone_number_two_company') {
                    changes.add("compañía telefónica");
                }
            }
        }
        if (changes.size > 0) {
            await sweetAlert("¿Confirmar cambios?", `¿Deseas modificar ${Array.from(changes).join(', ')}?`, "warning", "success", "Datos Actualizados");
            await patchPDFInformation(1, data);
            loadData();
        }
        else {
            sweetToast('warning', 'No se realizaron modificaciones');
        }
    }
    return (
        <>
            <div className="flex w-full flex-col">
                <Tabs aria-label="Options" fullWidth color="primary">
                    <Tab key="PDFInfo" title="PDF" className="flex flex-col gap-2">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        variant="underlined"
                                        label='Nombre del beneficiario'
                                        maxLength={100}
                                        isInvalid={errors.name ? true : false}
                                    />
                                )}
                            />
                            <Controller
                                name="bank_account"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        variant="underlined"
                                        label='Número de cuenta'
                                        startContent='N°'
                                        maxLength={50}
                                        isInvalid={errors.bank_account ? true : false}
                                    />
                                )}
                            />
                            <div className="flex flex-col gap-2 md:flex-row">
                                <Controller
                                    name="phone_number_one"
                                    control={control}
                                    rules={{
                                        required: true,
                                        pattern: /^[0-9]*$/
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            variant="underlined"
                                            label='Celular'
                                            startContent='+505'
                                            maxLength={8}
                                            isInvalid={errors.phone_number_one ? true : false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="phone_number_one_company"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Compañía"
                                            selectedKeys={String(field.value)}
                                            radius="sm"
                                            variant="underlined"
                                            disallowEmptySelection
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}>
                                            <SelectItem key={0} value={0}>Tigo</SelectItem>
                                            <SelectItem key={1} value={1}>Claro</SelectItem>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:flex-row">
                                <Controller
                                    name="phone_number_two"
                                    control={control}
                                    rules={{
                                        required: true,
                                        pattern: /^[0-9]*$/
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            variant="underlined"
                                            label='Celular'
                                            startContent='+505'
                                            maxLength={8}
                                            isInvalid={errors.phone_number_two ? true : false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="phone_number_two_company"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Compañía"
                                            selectedKeys={String(field.value)}
                                            radius="sm"
                                            variant="underlined"
                                            disallowEmptySelection
                                            onChange={(e) => {
                                                field.onChange(e);
                                            }}>
                                            <SelectItem key={0} value={0}>Tigo</SelectItem>
                                            <SelectItem key={1} value={1}>Claro</SelectItem>
                                        </Select>
                                    )}
                                />
                            </div>
                            <Button color="primary" size="lg" radius="sm" type="submit" fullWidth className="my-2">Guardar</Button>
                        </form>
                    </Tab>
                </Tabs>
            </div>
        </>
    );
}