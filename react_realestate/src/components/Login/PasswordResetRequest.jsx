import React from 'react';
import axios from 'axios';
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Input } from "@nextui-org/react";
import { sweetToast } from '../Main/Alert';

export default function PasswordResetRequest() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            await axios.post('http://localhost:8000/api/password_reset/', { email: data.email });
            sweetToast('success', 'Compruebe su correo electrónico para un enlace de restablecimiento de contraseña');
            setIsLoading(false);
            navigate('/');
        } catch (error) {
            sweetToast('error', 'No se pudo enviar el correo electrónico de restablecimiento de contraseña');
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <Card
                radius='sm'
                shadow='lg'
                className='w-1/3'>
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-md">Recuperar Contraseña</p>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody>
                        <div className="flex flex-col gap-2">
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoFocus
                                        label="Ingrese su correo"
                                        type="email"
                                        variant="underlined"
                                        readOnly={isLoading ? true : false}
                                        isInvalid={errors.email ? true : false}
                                    />
                                )}
                            />
                        </div>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <Button type='submit' color='primary' fullWidth size='lg' radius='sm' isLoading={isLoading}>Restablecer Contraseña</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};