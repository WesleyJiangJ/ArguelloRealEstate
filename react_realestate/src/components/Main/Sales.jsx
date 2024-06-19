import React from "react";
import Table from "./Table";
import { getAllSales } from "../../api/apiFunctions";

export default function Sales() {
    const [salesData, setSalesData] = React.useState([]);
    const INITIAL_VISIBLE_COLUMNS = ["full_name", "date_paid", "status"];
    const columns = [
        { name: "Nombres", uid: "full_name", sortable: false },
        { name: "Último Pago", uid: "date_paid", sortable: false },
        { name: "Estado", uid: "status", sortable: false },
    ];
    const statusColorMap = {
        true: "success",
        false: "danger",
    };
    const statusOptions = [
        { name: "Al Día", uid: true },
        { name: "Atraso", uid: false },
    ];
    const cellValues = [
        {
            firstColumn: "full_name",
            firstValue: "`${item.customer_data.first_name} ${item.customer_data.middle_name} ${item.customer_data.first_surname} ${item.customer_data.second_surname}`",
            secondValue: "`${item.plot_data.number}`"
        },
        {
            secondColumn: "date_paid",
            firstValue: "`${formatDate(item.date_paid)}`"
        },
        {
            thirdColumn: "status",
            firstValue: "`${new Date(item.date_paid).getFullYear() > new Date().getFullYear() || (new Date(item.date_paid).getFullYear() === new Date().getFullYear() && new Date(item.date_paid).getMonth() >= new Date().getMonth())}`",
            secondValue: {
                first: 'Al Día',
                second: 'Atraso'
            }
        }
    ];
    const sortedItem = {
        first: "``",
        second: "``"
    }
    const fetchData = async () => {
        try {
            setSalesData((await getAllSales()).data.filter((data) => data.status === 0).sort((a, b) => new Date(a.date_paid) - new Date(b.date_paid)));
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
                value={"Ventas"}
                showStatusDropdown={true}
                showColumnsDropdown={true}
                showAddButton={true}
                typeOfData={"Transacciones"}
                axiosResponse={salesData}
                fetchData={fetchData}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                columns={columns}
                statusColorMap={statusColorMap}
                statusOptions={statusOptions}
                statusFilterDefaultValue={false.toString()}
                cellValues={cellValues}
                sortedItem={sortedItem}
            />
        </>
    );
}