import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBOrganizationUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationTable({ organizations, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsborganization/edit/${cell.row.values.orgCode}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsborganization/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'orgCode',
            accessor: 'orgCode', // accessor is the "key" in the data
        },
        {
            Header: 'orgTranslationShort',
            accessor: 'orgTranslationShort',
        },
        {
            Header: 'orgTranslation',
            accessor: 'orgTranslation',
        },
        {
            Header: 'inactive',
            accessor: 'inactive',
            Cell: ({ value }) => value.toString()  // Explicitly convert boolean to string

        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBOrganizationTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBOrganizationTable"));
    } 

    return <OurTable
        data={organizations}
        columns={columns}
        testid={"UCSBOrganizationTable"}
    />;
};