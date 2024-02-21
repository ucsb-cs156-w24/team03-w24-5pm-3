import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewsTable from 'main/components/MenuItemReviews/MenuItemReviewsTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function MenuItemReviewIndexPage() {

    const currentUser = useCurrentUser();

    const { data: menuItemReviews, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/menuitemreviews/all"],
            { method: "GET", url: "/api/menuitemreviews/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/menuitemreviews/create"
                    style={{ float: "right" }}
                >
                    Create MenuItemReview
                </Button>
            )
        } 
    }

  return (
    <BasicLayout>
        <div className="pt-2">
            {createButton()}
            <h1>MenuItemReviews</h1>
            <MenuItemReviewsTable menuItemReviews={menuItemReviews} currentUser={currentUser} />
        </div>
    </BasicLayout>
);
}
