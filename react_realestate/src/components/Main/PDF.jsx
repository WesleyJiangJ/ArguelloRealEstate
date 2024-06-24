import React from 'react';
import { useParams } from "react-router-dom";
import { getAllInstallmentByCustomer, getPenalty, getSpecificSale, getPDFInformation } from "../../api/apiFunctions"
import { Page, Text, View, Document, Image, StyleSheet, PDFViewer, pdf } from '@react-pdf/renderer';
import Logo from '../../assets/images/logo.png';
import Stamp from '../../assets/images/stamp.png';
import Tigo from '../../assets/images/tigo.png';
import Claro from '../../assets/images/claro.png';
import { saveAs } from 'file-saver';
import { Button, Spinner } from '@nextui-org/react'

export default function PDF() {
    const param = useParams();
    const [data, setData] = React.useState([]);
    const [installment, setInstallment] = React.useState([]);
    const [showPenalty, setShowPenalty] = React.useState(false);
    const [penalty, setPenalty] = React.useState(0);
    const [pdfInformation, setPDFInformation] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isPdfLoading, setIsPDFLoading] = React.useState(true);
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF'
        },
        container: {
            margin: 10,
            padding: 10,
        },
        header: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: "#F2F5F8"
        },
        text_title: {
            fontSize: '20pt',
            marginLeft: '20px',
        },
        text: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: '15px'
        },
        text_date: {
            fontSize: 12,
            textAlign: 'right'
        },
        footer_text: {
            fontSize: 14,
            marginBottom: '10px'
        },
        mainContent: {
            flex: 1
        },
        image: {
            display: 'flex',
            width: '250px',
            margin: '20px'
        }
    });

    React.useEffect(() => {
        loadData();
    }, [param.id]);

    const loadData = async () => {
        setPDFInformation((await getPDFInformation(1)).data);
        const res = (await getSpecificSale(param.id)).data;
        setData(res);
        setInstallment((await getAllInstallmentByCustomer(res.customer_data?.id, param.id)).data);
        const penalty = (await getPenalty(param.id)).data;
        if (penalty.length !== 0) {
            setPenalty(penalty[0].total);
            setShowPenalty(true);
        }
        setIsLoading(false);
    }

    const currentDate = () => {
        const fecha = new Date();
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    const MyPDF = () => (
        <Document onRender={() => setIsPDFLoading(false)}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image src={Logo} style={styles.image} />
                    <Text style={styles.text_title}>Estado de Cuenta</Text>
                </View>
                <View style={styles.mainContent}>
                    <View style={styles.container}>
                        <Text style={styles.text_date}>
                            {currentDate()}
                        </Text>

                        <Text style={styles.text}>
                            {data.customer_data?.first_name} {data.customer_data?.middle_name} {data.customer_data?.first_surname} {data.customer_data?.second_surname}
                        </Text>

                        <Text style={styles.text}>
                            {data.customer_data?.dni}
                        </Text>

                        <Text style={styles.text}>
                            Lote N°{data.plot_data?.number}
                        </Text>

                        <Text style={styles.text}>
                            {data.status === 0 ? 'Proceso de venta' : data.status === 1 ? 'Vendido' : 'Anulado'}
                        </Text>

                    </View>
                    <View style={styles.container}>
                        <Text style={[styles.text, { fontSize: 20, marginBottom: '20px', backgroundColor: '#F2F5F8', padding: '5px', borderRadius: '4px' }]}>
                            Detalles
                        </Text>

                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={[styles.text]}>
                                Último mes abonado
                            </Text>
                            <Text style={[styles.text]}>
                                {installment.length === 1 ? 'Se pagó la prima' : data.date_paid ? data.date_paid : 'Aún no se han realizado pagos'}
                            </Text>
                        </View>

                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={[styles.text]}>
                                Cuotas pagadas
                            </Text>
                            <Text style={[styles.text]}>
                                {installment.length === 0 ? 0 : installment.length === 1 ? 0 : installment.length - 1}
                            </Text>
                        </View>

                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={[styles.text]}>
                                Precio del lote
                            </Text>
                            <Text style={[styles.text]}>
                                {`$${parseFloat(data.price).toLocaleString()}`}
                            </Text>
                        </View>

                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={[styles.text]}>
                                Total abonado
                            </Text>
                            <Text style={[styles.text]}>
                                {`$${parseFloat(data.total_paid).toLocaleString()}`}
                            </Text>
                        </View>

                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={[styles.text]}>
                                Pendiente
                            </Text>
                            <Text style={[styles.text]}>
                                {`$${(parseFloat(data.price) - parseFloat(data.total_paid)).toLocaleString()}`}
                            </Text>
                        </View>

                        {showPenalty &&
                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <Text style={[styles.text]}>
                                    Mora
                                </Text>
                                <Text style={[styles.text]}>
                                    {`$${parseFloat(penalty).toLocaleString()}`}
                                </Text>
                            </View>
                        }

                    </View>
                    <View style={[{ flexDirection: 'column', marginTop: 'auto', padding: 10, backgroundColor: '#F2F5F8' }]}>
                        <Text style={styles.footer_text}>Emitido por área de cobranza</Text>
                        <Text style={styles.footer_text}>Este recibo respalda el pago reflejado en el comprobante del mes indicado</Text>
                        <Text style={styles.footer_text}>{`Deposite a la cuenta bancaria N°:${pdfInformation.bank_account} a nombre de ${pdfInformation.name}`}</Text>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <View style={[{ flexDirection: 'column' }]}>
                                <Text style={styles.footer_text}>Oficina Central</Text>
                                <View style={[{ flexDirection: 'row' }]}>
                                    <Image src={pdfInformation.phone_number_one_company === 0 ? Tigo : Claro} style={[{ marginRight: '5px', width: '15px', height: '15px' }]} />
                                    <Text style={[styles.footer_text]}>+505 {pdfInformation.phone_number_one}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row' }]}>
                                    <Image src={pdfInformation.phone_number_two_company === 0 ? Tigo : Claro} style={[{ marginRight: '5px', width: '15px', height: '15px' }]} />
                                    <Text style={[styles.footer_text]}>+505 {pdfInformation.phone_number_two}</Text>
                                </View>
                            </View>
                            <Image src={Stamp} style={[{ width: '90px', height: '90px' }]} />
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
    const downloadPdf = async () => {
        const fileName = `${data.plot_data?.number}_${data.customer_data?.first_name}_${data.customer_data?.first_surname}_${data.date_paid}.pdf`;
        const blob = await pdf(<MyPDF />).toBlob();
        saveAs(blob, fileName);
    };
    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <Spinner size="lg" />
                </div>
            ) : (
                <>
                    <Button radius='sm' size='lg' className='bg-primary text-white my-2' fullWidth onClick={() => downloadPdf()}>Descargar</Button>
                    {isPdfLoading && (
                        <div className="flex items-center justify-center w-full h-full">
                            <Spinner size="lg" />
                        </div>
                    )}
                    <PDFViewer className='w-full h-full'>
                        <MyPDF />
                    </PDFViewer>
                </>
            )}
        </>
    );
}