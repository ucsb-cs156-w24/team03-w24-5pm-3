import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationTable from 'main/components/UCSBOrganization/UCSBOrganizationTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function UCSBOrganizationIndexPage() {

    const currentUser = useCurrentUser();

    const { data: organizations, error: _error, status: _status } =
        useBackend(
            ["/api/UCSBOrganization/all"],
            { method: "GET", url: "/api/UCSBOrganization/all" },
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/UCSBOrganization/create"
                    style={{ float: "right" }}
                >
                    Create Organization
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>UCSB Organization</h1>
                <UCSBOrganizationTable organizations={organizations} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}