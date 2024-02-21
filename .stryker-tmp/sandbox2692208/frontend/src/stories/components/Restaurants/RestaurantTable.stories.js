import React from 'react';
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { restaurantFixtures } from 'fixtures/restaurantFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/Restaurants/RestaurantTable',
    component: RestaurantTable
};

const Template = (args) => {
    return (
        <RestaurantTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    restaurants: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    restaurants: restaurantFixtures.threeRestaurants,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    restaurants: restaurantFixtures.threeRestaurants,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/restaurants', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
