import { useNavigate } from 'react-router-dom';
import Login from '../../assets/images/login.jpg'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Link } from "@nextui-org/react";
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function LoginModal({ isOpen, onOpenChange }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/main/customer');
    };

    return (
        <>
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
                    {() => (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div>
                                    <ModalHeader className="flex flex-col gap-1">Bienvenidos</ModalHeader>
                                    <ModalBody>
                                        <Input
                                            autoFocus
                                            label="Usuario"
                                            type="text"
                                            placeholder="Ingresa tu usuario"
                                            variant="underlined"
                                            startContent={<UserIcon className='w-5 h-5'/>}
                                        />
                                        <Input
                                            label="Contraseña"
                                            placeholder="Ingresa tu contraseña"
                                            type="password"
                                            variant="underlined"
                                            startContent={<LockClosedIcon className='w-5 h-5'/>}
                                        />
                                        <div className="flex py-2 px-1 justify-end">
                                            <Link color="primary" href="#" size="sm">
                                                ¿Olvidaste la contraseña?
                                            </Link>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color='primary'
                                            radius="sm"
                                            onClick={handleClick}>
                                            Ingresar
                                        </Button>

                                    </ModalFooter>
                                </div>

                                <div className="hidden lg:inline">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={Login}
                                        alt="Login Image"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}