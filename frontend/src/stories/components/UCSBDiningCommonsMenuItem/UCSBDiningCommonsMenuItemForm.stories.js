import React from 'react';
import UCSBDiningCommonMenuItemForm from "main/components/UCSBDiningCommonMenuItem/UCSBDiningCommonMenuItemForm"
import { ucsbDiningCommonsMenuItemFixtures } from 'fixtures/ucsbDiningCommonsMenuItemFixtures';

export default {
    title: 'components/UCSBDiningCommonMenuItem/UCSBDiningCommonMenuItemForm',
    component: UCSBDiningCommonMenuItemForm
};

const Template = (args) => {
    return (
        <UCSBDiningCommonMenuItemForm {...args} />
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
    initialContents: ucsbDiningCommonsMenuItemFixtures.oneRestaurant[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};