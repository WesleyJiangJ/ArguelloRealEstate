import React from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form"
import { Card, CardHeader, CardBody, Button, Input, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure } from "@nextui-org/react";
import { getSpecificSale } from "../../api/apiFunctions"
import { ChatBubbleOvalLeftEllipsisIcon, PlusIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline"
import { sweetAlert, sweetToast } from "./Alert";

export default function SalesDetail() {
    const param = useParams();
    const [saleData, setSaleData] = React.useState([]);

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setSaleData((await getSpecificSale(param.id)).data);
        console.log(saleData);
    }
    return (
        <>

        </>
    );
}