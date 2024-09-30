import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form"
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Input } from "@nextui-org/react";
import { sweetToast } from '../Main/Alert';

export default function PasswordResetConfirm() {
    const apiURL = import.meta.env.VITE_API_URL;
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors }, setError } = useForm({
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        }
    });

    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            sweetToast('error', 'Las contraseñas no coinciden');
            setError('newPassword');
            setError('confirmPassword');
            return;
        }
        try {
            await axios.post(`${apiURL}/api/password_reset_confirm/${uidb64}/${token}/`, {
                new_password: data.newPassword,
                confirm_password: data.confirmPassword,
            });
            sweetToast('success', 'La contraseña ha sido actualizada');
            navigate('/');
        } catch (error) {
            sweetToast('error', 'Failed to reset password.');
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
                        <p className="text-md">Confirmar Recuperación de Contraseña</p>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody>
                        <div className="flex flex-col gap-2">
                            <Controller
                                name="newPassword"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoFocus
                                        label="Nueva contraseña"
                                        type="password"
                                        variant="underlined"
                                        isInvalid={errors.newPassword ? true : false}
                                    />
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Confirmar contraseña"
                                        type="password"
                                        variant="underlined"
                                        isInvalid={errors.confirmPassword ? true : false}
                                    />
                                )}
                            />
                        </div>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <Button type='submit' color='primary' fullWidth size='lg' radius='sm' >Restablecer Contraseña</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};