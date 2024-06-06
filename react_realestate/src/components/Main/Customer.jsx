import React from "react";
import Table from "./Table";
import { getAllCustomers } from "../../api/apiFunctions";

export default function Customer() {
    const [customerData, setCustomerData] = React.useState([]);
    const INITIAL_VISIBLE_COLUMNS = ["full_name", "status"];
    const columns = [
        { name: "Nombres", uid: "full_name", sortable: true },
        { name: "Celular", uid: "phone_number", sortable: true },
        { name: "Estado", uid: "status", sortable: false },
    ];
    const statusColorMap = {
        true: "success",
        false: "danger",
    };
    const statusOptions = [
        { name: "Activo", uid: true },
        { name: "Inactivo", uid: false },
    ];
    const cellValues = [
        {
            firstColumn: "full_name",
            firstValue: "`${item.first_name} ${item.middle_name} ${item.first_surname} ${item.second_surname}`",
            secondValue: "`${item.email}`"
        },
        {
            secondColum: "phone_number",
            firstValue: "`${item.phone_number}`"
        },
        {
            thirdColumn: "status",
            firstValue: "`${item.status}`",
            secondValue: {
                first: 'Activo',
                second: 'Inactivo'
            }
        }
    ];
    const sortedItem = {
        first: "`${a.first_name} ${a.middle_name} ${a.first_lastname} ${a.second_lastname}`",
        second: "`${b.first_name} ${b.middle_name} ${b.first_lastname} ${b.second_lastname}`"
    }
    const fetchData = async () => {
        try {
            setCustomerData((await getAllCustomers()).data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    React.useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <Table
                value={"User"}
                showStatusDropdown={true}
                showColumnsDropdown={true}
                showAddButton={true}
                typeOfData={"Clientes"}
                axiosResponse={customerData}
                fetchData={fetchData}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                columns={columns}
                statusColorMap={statusColorMap}
                statusOptions={statusOptions}
                cellValues={cellValues}
                sortedItem={sortedItem}
            />
        </>
    );
}