import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form"
import { getUser } from '../../api/apiFunctions'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Link } from "@nextui-org/react";
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Login from '../../assets/images/login.jpg'

export default function LoginModal({ isOpen, onOpenChange }) {
    const navigate = useNavigate();
    const [isVisiblePassword, setIsVisiblePassword] = React.useState(false);
    const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);
    const { control, handleSubmit, formState: { errors }, reset, setError } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username: data.username,
                password: data.password,
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            navigate('/main/customer');
            const name = (await getUser(data.username)).data;
            localStorage.setItem('name', `${name[0].first_name} ${name[0].last_name}`);
            reset();
        } catch (error) {
            setError('username');
            setError('password');
            console.error('Error logging in', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton
            backdrop="blur"
            shadow='lg'
            placement="top-center"
            size="3xl"
            radius="sm">
            <ModalContent>
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <ModalHeader className="flex flex-col gap-1">Bienvenidos</ModalHeader>
                                <ModalBody>
                                    <Controller
                                        name="username"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                autoFocus
                                                label="Usuario"
                                                type="text"
                                                placeholder="Ingresa tu usuario"
                                                variant="underlined"
                                                startContent={<UserIcon className='w-5 h-5' />}
                                                isInvalid={errors.username ? true : false}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                label="Contraseña"
                                                placeholder="Ingresa tu contraseña"
                                                type={isVisiblePassword ? "text" : "password"}
                                                variant="underlined"
                                                startContent={<LockClosedIcon className='w-5 h-5' />}
                                                endContent={
                                                    <Button className="focus:outline-none bg-white" type="button" isIconOnly onClick={toggleVisibility}>
                                                        {isVisiblePassword ? (
                                                            <EyeIcon className="w-5 h-5" />
                                                        ) : (
                                                            <EyeSlashIcon className="w-5 h-5" />
                                                        )}
                                                    </Button>
                                                }
                                                isInvalid={errors.password ? true : false}
                                            />
                                        )}
                                    />
                                    <div className="flex py-2 px-1 justify-end">
                                        <Link color="primary" size="sm" className='cursor-pointer' onPress={() => navigate('/password-reset')}>
                                            ¿Olvidaste la contraseña?
                                        </Link>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color='primary'
                                        radius="sm"
                                        type='submit'>
                                        Ingresar
                                    </Button>
                                </ModalFooter>
                            </div>
                        </form>
                        <div className="hidden lg:inline">
                            <img
                                className="w-full h-full object-cover"
                                src={Login}
                                alt="Login Image"
                            />
                        </div>
                    </div>
                </>
            </ModalContent>
        </Modal>
    );
}