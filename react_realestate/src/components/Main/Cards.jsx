import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@nextui-org/react';

export default function Cards({ id, plot, name, plotPrice, pending, paid }) {
    const navigate = useNavigate();
    return (
        <>
            <div className='m-2'>
                <Card
                    shadow='none'
                    radius='sm'
                    className='bg-primary text-white'>
                    <CardHeader>
                        <div className="flex flex-col">
                            <h1 className='text-xl font-bold'>{plot}</h1>
                            <p className='text-md font-thin'>{name}</p>
                        </div>
                    </CardHeader>
                    <CardBody className='gap-2'>
                        <p>{plotPrice}</p>
                        <p>{pending}</p>
                        <p>{paid}</p>
                    </CardBody>
                    <CardFooter>
                        <Button
                            fullWidth
                            radius='sm'
                            className='bg-card mb-2'
                            size='lg'
                            onClick={() => navigate(`/main/sales/detail/${id}`)}>
                            Detalles
                        </Button>
                    </CardFooter>
                </Card >
            </div >
        </>
    );
}