import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function RestaurantIndexPage() {

    const currentUser = useCurrentUser();

    const { data: restaurants, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/restaurants/all"],
            { method: "GET", url: "/api/restaurants/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/restaurants/create"
                    style={{ float: "right" }}
                >
                    Create Restaurant
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>Restaurants</h1>
                <RestaurantTable restaurants={restaurants} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}