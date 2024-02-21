import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBDiningCommonsMenuItemForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Dining Commons Code", "Name", "Station"];
    const testId = "UCSBDiningCommonsMenuItemForm";
    const sub_name = "name";
    const sub_diningCommonsCode = "diningCommonsCode";
    const sub_station = "station";
    const sub_submit = "submit";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm initialContents={ucsbDiningCommonsMenuItemFixtures.oneMenuItem} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBDiningCommonsMenuItemForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Dining Commons Code is required/);
        expect(screen.getByText(/Dining Commons Code is required/)).toBeInTheDocument();

        await screen.findByText(/Name is required/);
        expect(screen.getByText(/Name is required/)).toBeInTheDocument();

        await screen.findByText(/Station is required/);
        expect(screen.getByText(/Station is required/)).toBeInTheDocument();

        const nameInput = screen.getByTestId(`${testId}-${sub_name}`);
        fireEvent.change(nameInput, { sub_name: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);
        
        const diningCommonsCodeInput = screen.getByTestId(`${testId}-${sub_diningCommonsCode}`);
        fireEvent.change(diningCommonsCodeInput, { sub_diningCommonsCode: {} });
        fireEvent.click(submitButton);

        const stationInput = screen.getByTestId(`${testId}-${sub_station}`);
        fireEvent.change(stationInput, { sub_station: {} });
        fireEvent.click(submitButton);

        const submitInput = screen.getByTestId(`${testId}-${sub_submit}`);
        fireEvent.change(submitInput, { sub_submit: {} });
        fireEvent.click(submitButton);

    });

});