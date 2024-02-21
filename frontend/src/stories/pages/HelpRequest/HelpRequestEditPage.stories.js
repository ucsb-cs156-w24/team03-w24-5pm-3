import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";
import { helpRequestFixtures } from 'fixtures/helpRequestFixtures';

export default {
    title: 'pages/HelpRequest/HelpRequestEditPage',
    component: HelpRequestEditPage
};

const Template = () => <HelpRequestEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/helprequests', (_req, res, ctx) => {
            return res(ctx.json(helpRequestFixtures.threeRequests[0]));
        }),
        rest.put('/api/helprequests', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



