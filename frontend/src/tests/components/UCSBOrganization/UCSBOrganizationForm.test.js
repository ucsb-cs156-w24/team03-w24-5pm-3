import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { UCSBOrganizationFixtures } from "fixtures/UCSBOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Organization Translation (short)", "Organization Translation", "Inactive"];
    const testId = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
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
                    <UCSBOrganizationForm initialContents={UCSBOrganizationFixtures.oneOrganization} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-orgTranslationShort`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-orgTranslation`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-inactive`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();
        expect(screen.getByText(`Organization Code`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
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
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Organization code is required/);
        expect(screen.getByText(/Shortened organization translation is required/)).toBeInTheDocument();
        expect(screen.getByText(/Organization translation is required/)).toBeInTheDocument();

        const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
        fireEvent.change(orgCodeInput, { target: { value: "a".repeat(6) } });

        const orgTranslationShortInput = screen.getByTestId(`${testId}-orgTranslationShort`);
        fireEvent.change(orgTranslationShortInput, { target: { value: "a".repeat(51) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 5 characters/)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText(/Max length 50 characters/)).toBeInTheDocument();
        });
    });
});