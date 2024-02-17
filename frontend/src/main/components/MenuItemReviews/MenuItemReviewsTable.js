import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/menuItemReviewUtils" // have to make this
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

// note this file is called MenuItemReviewsTable, not MenuItemReviewTable (i would note this either way tbh)

export default function MenuItemReviewsTable({ menuItemReviews, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/menuitemreviews/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/menuitemreviews/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Menu Item Id',
            accessor: 'itemId',
        },
        {
            Header: 'Email',
            accessor: 'reviewerEmail',
        },
        {
            Header: 'Stars',
            accessor: 'stars',
        },
        {
            Header: 'Date (iso format)',
            accessor: 'dateReviewed',
        },
        {
            Header: 'Comments',
            accessor: 'comments',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "MenuItemReviewsTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "MenuItemReviewsTable"));
    } 

    return <OurTable
        data={menuItemReviews}
        columns={columns}
        testid={"MenuItemReviewsTable"}
    />;

}