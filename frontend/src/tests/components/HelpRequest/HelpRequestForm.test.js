import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a HelpRequest", async () => {

        render(
            <Router  >
                <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
            </Router>
        );
        await screen.findByTestId(/HelpRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-TeamId");
        const requesterEmailField = screen.getByTestId("HelpRequestForm-RequesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-TeamId");
        const submitButton = screen.getByTestId("HelpRequestForm-Submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(teamIdField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email must be a valid email./);
        expect(screen.getByText(/Team ID must be a valid team id./)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-Submit");
        const submitButton = screen.getByTestId("HelpRequestForm-Submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email is required./);
        expect(screen.getByText(/Team ID is required./)).toBeInTheDocument();
        expect(screen.getByText(/Table or Breakout Room is required./)).toBeInTheDocument();
        expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-TeamId");

        const requesterEmailField = screen.getByTestId("HelpRequestForm-RequesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-TeamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-TableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-RequestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-Explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-Solved");
        const submitButton = screen.getByTestId("HelpRequestForm-Submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bendover@gmail.com' } });
        fireEvent.change(teamIdField, { target: { value: 'w24-5pm-4' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: 'Table 1' } });
        fireEvent.change(requestTimeField, { target: { value: '2024-02-10T12:00:00' } });
        fireEvent.change(explanationField, { target: { value: 'Test Help Request 01' } });
        fireEvent.click(solvedField);
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Requester Email must be a valid email./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Team ID must be a valid team id./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-Cancel");
        const cancelButton = screen.getByTestId("HelpRequestForm-Cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


