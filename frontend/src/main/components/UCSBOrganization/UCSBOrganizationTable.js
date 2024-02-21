import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBOrganizationUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationTable({
    organizations,
    currentUser,
    testIdPrefix = "UCSBOrganizationTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/UCSBOrganization/edit/${cell.row.values.orgCode}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/UCSBOrganization/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this

    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'OrgCode',
            accessor: 'orgCode', 
        },

        {
            Header: 'OrgTranslationShort',
            accessor: 'orgTranslationShort',
        },
        {
            Header: 'OrgTranslation',
            accessor: 'orgTranslation',
        },
        {
            Header: 'Inactive',
            id: 'inactive',
            accessor: (row, _rowIndex) => String(row.inactive) 
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    } 

    return <OurTable
        data={organizations}
        columns={columns}
        testid={testIdPrefix}
    />;
};