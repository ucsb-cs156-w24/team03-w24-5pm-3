import React from 'react';
import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm"
import { menuItemReviewFixtures } from 'fixtures/menuItemReviewFixtures';

export default {
    title: 'components/MenuItemReviews/MenuItemReviewForm',
    component: MenuItemReviewForm
};

const Template = (args) => {
    return (
        <MenuItemReviewForm {...args} />
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
    initialContents: menuItemReviewFixtures.oneMenuItemReview[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};