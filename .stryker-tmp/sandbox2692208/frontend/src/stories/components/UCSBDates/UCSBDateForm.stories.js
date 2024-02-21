import React from 'react';
import UCSBDateForm from "main/components/UCSBDates/UCSBDateForm"
import { ucsbDatesFixtures } from 'fixtures/ucsbDatesFixtures';

export default {
    title: 'components/UCSBDates/UCSBDateForm',
    component: UCSBDateForm
};


const Template = (args) => {
    return (
        <UCSBDateForm {...args} />
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
    initialContents: ucsbDatesFixtures.oneDate,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};
