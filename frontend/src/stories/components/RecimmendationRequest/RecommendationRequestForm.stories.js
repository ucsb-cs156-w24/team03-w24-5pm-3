import React from 'react';
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm"
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';

export default {
    title: 'components/RecommendationRequest/RecommendationRequestForm',
    component: RecommendationRequestForm
};


const Template = (args) => {
    return (
        <RecommendationRequestForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: recommendationRequestFixtures.oneDate,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};
