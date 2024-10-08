import React from "react";
import { useForm, Controller } from "react-hook-form"
import { Tabs, Tab, Input, Select, SelectItem, Button } from "@nextui-org/react";
import { sweetAlert, sweetToast } from "./Alert";
import { getPDFInformation, patchPDFInformation, downloadDatabase, handleFileUpload } from "../../api/apiFunctions";
import { PlusIcon, ArrowUpTrayIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

export default function Settings() {
    const [file, setFile] = React.useState(null);
    const [isVisiblePassword, setIsVisiblePassword] = React.useState(false);
    const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);
    const [prevData, setPrevData] = React.useState({});
    const [prevDataBackup, setPrevDataBackup] = React.useState({});
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
    const { control: controlBackup, handleSubmit: handleSubmitBackup, formState: { errors: errorsBackup }, reset: resetBackup } = useForm({
        defaultValues: {
            backup_email: '',
            app_password: ''
        }
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = (await getPDFInformation(1)).data;
        reset({ ...res });
        setPrevData({ ...res });
        resetBackup({ backup_email: res.backup_email, app_password: res.app_password });
        setPrevDataBackup({ backup_email: res.backup_email, app_password: res.app_password });
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

    const onSubmitBackup = async (data) => {
        let changes = new Set();
        for (const key in prevDataBackup) {
            if (prevDataBackup[key] !== data[key]) {
                if (key === "backup_email") {
                    changes.add("correo");
                }
                else if (key === "app_password") {
                    changes.add("contraseña");
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <>
            <div className="flex w-full flex-col">
                <Tabs aria-label="Options" fullWidth color="primary">
                    <Tab key="database" title="Base de datos" className="flex flex-col gap-10">
                        <div>
                            <h1 className="my-2">Exportar</h1>
                            <Button
                                color="primary"
                                size="lg"
                                radius="sm"
                                fullWidth
                                endContent={<ArrowUpTrayIcon className="w-5 h-5" />}
                                onClick={() => downloadDatabase()}>
                                Exportar base de datos
                            </Button>
                        </div>
                        <div>
                            <h1 className="my-2">Importar</h1>
                            <div className="flex flex-row gap-2">
                                <input
                                    className="w-full bg-sidebar rounded-sm"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <Button
                                    color="primary"
                                    size='lg'
                                    radius="sm"
                                    isIconOnly
                                    onClick={() => handleFileUpload(file)}>
                                    <PlusIcon className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Tab>
                    <Tab key="backup" title="Backup" className="flex flex-col gap-2">
                        <form onSubmit={handleSubmitBackup(onSubmitBackup)}>
                            <Controller
                                name="backup_email"
                                control={controlBackup}
                                rules={{
                                    required: true,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                    }
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        variant="underlined"
                                        label='Correo'
                                        type="email"
                                        isInvalid={errorsBackup.email ? true : false}
                                    />
                                )}
                            />
                            <Controller
                                name="app_password"
                                control={controlBackup}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label='Contraseñas de aplicaciones'
                                        variant="underlined"
                                        type={isVisiblePassword ? "text" : "password"}
                                        isInvalid={errorsBackup.app_password ? true : false}
                                        maxLength={20}
                                        endContent={
                                            <Button className="focus:outline-none bg-white" type="button" isIconOnly onClick={toggleVisibility}>
                                                {isVisiblePassword ? (
                                                    <EyeIcon className="w-5 h-5" />
                                                ) : (
                                                    <EyeSlashIcon className="w-5 h-5" />
                                                )}
                                            </Button>
                                        }
                                    />
                                )}
                            />
                            <Button color="primary" size="lg" radius="sm" type="submit" fullWidth className="my-2">Guardar</Button>
                        </form>
                    </Tab>
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