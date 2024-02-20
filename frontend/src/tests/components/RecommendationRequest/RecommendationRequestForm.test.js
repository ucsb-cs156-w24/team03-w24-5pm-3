import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RecommendationRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Professor Email/);
        await screen.findByText(/Explanation/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a RecommendatioRequest", async () => {

        render(
            <Router  >
                <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
            </Router>
        );
        await screen.findByTestId(/RecommendationRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");


    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(explanationField, { target: { value: 'bad-input' } });
        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        fireEvent.change(doneField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Requester email must be a valid email address./);
        expect(screen.getByText(/Date Requested is required in ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Date Needed is required in ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Professor email must be a valid email address./)).toBeInTheDocument();
        expect(screen.getByText(/Requester email must be a valid email address./)).toBeInTheDocument();
    });

    // test("Regex tests", async () => {
    //
    //     render(
    //         <Router  >
    //             <RecommendationRequestForm />
    //         </Router>
    //     );
    //     await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    //     const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
    //     const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
    //     const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
    //     const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
    //     const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
    //     const doneField = screen.getByTestId("RecommendationRequestForm-done");
    //     const submitButton = screen.getByTestId("RecommendationRequestForm-submit");
    //
    //     fireEvent.change(requesterEmailField, { target: { value: 'stu1ucsbedu' } });
    //     fireEvent.change(professorEmailField, { target: { value: '@prof1ucsbedu' } });
    //     fireEvent.change(explanationField, { target: { value: 'BS/MS' } });
    //     fireEvent.change(dateRequestedField, { target: { value: '2022-01-03T00:00:0' } });
    //     fireEvent.change(dateNeededField, { target: { value: '2022-03-11T00:00:0' } });
    //     fireEvent.change(doneField, { target: { value: 'false' } });
    //     fireEvent.click(submitButton);
    //
    //     await screen.findByText(/Requester email must be a valid email address./);
    //     expect(screen.getByText(/Date Requested is required in ISO format./)).toBeInTheDocument();
    //     expect(screen.getByText(/Date Needed is required in ISO format./)).toBeInTheDocument();
    //     expect(screen.getByText(/Professor email must be a valid email address./)).toBeInTheDocument();
    //     expect(screen.getByText(/Requester email must be a valid email address./)).toBeInTheDocument();
    // });
    //
    // test("More regex tests for email", async () => {
    //
    //     render(
    //         <Router  >
    //             <RecommendationRequestForm />
    //         </Router>
    //     );
    //     // Test for invalid email formats
    //     const invalidEmails = ['@ucsb.edu', 'stu1@', 'stu1@.e', 'stu1@ucsb', 'stu1ucsb.edu', 'stu1@ucsb..edu'];
    //     const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
    //
    //     for (const email of invalidEmails) {
    //         fireEvent.change(requesterEmailField, {target: {value: email}});
    //         const submitButton = screen.getByTestId("RecommendationRequestForm-submit");
    //         fireEvent.click(submitButton);
    //         await screen.findByText(/Requester email must be a valid email address./);
    //         //expect(screen.queryByText(/Requester email must be a valid email address./)).toBeInTheDocument();
    //         // Clear field for next iteration
    //         fireEvent.change(requesterEmailField, {target: {value: ''}});
    //
    //     }
    //
    // });
    //
    // test("More regex tests for calender", async () => {
    //
    //     render(
    //         <Router  >
    //             <RecommendationRequestForm />
    //         </Router>
    //     );
    //
    //
    //
    //
    // });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Requester email is required./);
        expect(screen.getByText(/Professor email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Requested is required in ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Date Needed is required in ISO format./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <RecommendationRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'stu1@ucsb.edu' } });
        fireEvent.change(professorEmailField, { target: { value: 'prof1@ucsb.edu' } });
        fireEvent.change(explanationField, { target: { value: 'BS/MS' } });
        fireEvent.change(dateRequestedField, { target: { value: '2022-01-03T00:00:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2022-03-11T00:00:00' } });
        fireEvent.change(doneField, { target: { value: 'false' } });
        fireEvent.click(submitButton);


        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Requester email must be a valid email address./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Professor email must be a valid email address./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Requested is required in ISO format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Needed is required in ISO format./)).not.toBeInTheDocument();


    });




    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-cancel");
        const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


