import React from 'react';
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { ucsbOrganizationFixtures } from 'fixtures/UCSBOrganizationFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBOrganization/UCSBOrganizationTable',
    component: UCSBOrganizationTable
};

const Template = (args) => {
    return (
        <UCSBOrganizationTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    organizations: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    organizations: ucsbOrganizationFixtures.threeOrganization,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    organizations: ucsbOrganizationFixtures.threeOrganization,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/ucsborganization', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};