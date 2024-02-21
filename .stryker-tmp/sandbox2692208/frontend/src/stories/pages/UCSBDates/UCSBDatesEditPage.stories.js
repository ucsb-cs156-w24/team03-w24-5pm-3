
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDatesFixtures } from "fixtures/ucsbDatesFixtures";
import { rest } from "msw";

import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

export default {
    title: 'pages/UCSBDates/UCSBDatesEditPage',
    component: UCSBDatesEditPage
};

const Template = () => <UCSBDatesEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbdates', (_req, res, ctx) => {
            return res(ctx.json(ucsbDatesFixtures.threeDates[0]));
        }),
        rest.put('/api/ucsbdates', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



