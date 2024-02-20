import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestTable from 'main/components/HelpRequest/HelpRequestTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function HelpRequestIndexPage() {

    const currentUser = useCurrentUser();

    const { data: helpRequests, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/HelpRequest/all"],
            { method: "GET", url: "/api/HelpRequest/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/helprequest/create"
                    style={{ float: "right" }}
                >
                    Create Help Request
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>Help Requests</h1>
                <HelpRequestTable helpRequests={helpRequests} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}