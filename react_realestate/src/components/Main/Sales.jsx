import React from "react";
import Table from "./Table";
import { getAllSales } from "../../api/apiFunctions";

export default function Sales() {
    const [salesData, setSalesData] = React.useState([]);
    const INITIAL_VISIBLE_COLUMNS = ["full_name", "plot", "status"];
    const columns = [
        { name: "Nombres", uid: "full_name", sortable: false },
        { name: "Lote", uid: "plot", sortable: false },
        { name: "Estado", uid: "status", sortable: false },
    ];
    const statusColorMap = {
        0: "danger",
        1: "success",
    };
    const statusOptions = [
        { name: "Proceso", uid: true },
        { name: "Vendido", uid: false },
    ];
    const cellValues = [
        {
            firstColumn: "full_name",
            firstValue: "`${item.customer_data.first_name} ${item.customer_data.middle_name} ${item.customer_data.first_surname} ${item.customer_data.second_surname}`",
            secondValue: "``"
        },
        {
            secondColumn: "plot",
            firstValue: "`${item.plot_data.number}`"
        },
        {
            thirdColumn: "status",
            firstValue: "`${item.status === 0 ? true : item.status === 2 ? false : ''}`",
            secondValue: {
                first: 'Vendido',
                second: 'Proceso'
            }
        }
    ];
    const sortedItem = {
        first: "`${a.customer_data.first_name}`",
        second: "`${b.customer_data.first_name}`"
    }
    const fetchData = async () => {
        try {
            setSalesData((await getAllSales()).data);
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
                cellValues={cellValues}
                sortedItem={sortedItem}
            />
        </>
    );
}