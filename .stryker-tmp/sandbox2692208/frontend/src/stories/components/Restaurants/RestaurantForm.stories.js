import React from 'react';
import RestaurantForm from "main/components/Restaurants/RestaurantForm"
import { restaurantFixtures } from 'fixtures/restaurantFixtures';

export default {
    title: 'components/Restaurants/RestaurantForm',
    component: RestaurantForm
};

const Template = (args) => {
    return (
        <RestaurantForm {...args} />
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
    initialContents: restaurantFixtures.oneRestaurant[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};