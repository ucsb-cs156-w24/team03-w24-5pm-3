import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditForm from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            orgCode: "SKY"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "SKY" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditForm />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Organization");
            expect(screen.queryByTestId("UCSBOrganization-orgCode")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "SKY" } }).reply(200, {
                orgCode: "SKY",
                orgTranslationShort: "SKYDIVING CLUB",
                orgTranslation: "SKYDIVING CLUB AT UCSB",
                inactive: false
            });
            axiosMock.onPut('/api/UCSBOrganization').reply(200, {
                orgCode: "SKY",
                orgTranslationShort: "SKYWATCHING CLUB",
                orgTranslation: "SKYWATCHING CLUB AT UCSB",
                inactive: true
            });
        });

        const queryClient = new QueryClient();

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditForm />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveCheck = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCodeField).toBeInTheDocument();
            expect(orgCodeField).toHaveValue("SKY");
            expect(orgTranslationShortField).toBeInTheDocument();
            expect(orgTranslationShortField).toHaveValue("SKYDIVING CLUB");
            expect(orgTranslationField).toBeInTheDocument();
            expect(orgTranslationField).toHaveValue("SKYDIVING CLUB AT UCSB");
            expect(inactiveCheck).toBeInTheDocument();
            expect(inactiveCheck).not.toBeChecked();

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(orgTranslationShortField, { target: { value: 'SKYWATCHING CLUB' } });
            fireEvent.change(orgTranslationField, { target: { value: 'SKYWATCHING CLUB AT UCSB' } });
            fireEvent.click(inactiveCheck);
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Organization Updated - orgCode: SKY orgTranslationShort: SKYWATCHING CLUB");

            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganization" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "SKY" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgTranslationShort: 'SKYWATCHING CLUB',
                orgTranslation: 'SKYWATCHING CLUB AT UCSB',
                inactive: true
            })); 


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditForm />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveCheck = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCodeField).toHaveValue("SKY");
            expect(orgTranslationShortField).toHaveValue("SKYDIVING CLUB");
            expect(orgTranslationField).toHaveValue("SKYDIVING CLUB AT UCSB");
            expect(inactiveCheck).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(orgTranslationShortField, { target: { value: 'SKYWATCHING CLUB' } })
            fireEvent.change(orgTranslationField, { target: { value: 'SKYWATCHING CLUB AT UCSB' } })
            fireEvent.click(inactiveCheck);

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Organization Updated - orgCode: SKY orgTranslationShort: SKYWATCHING CLUB");
            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganization" });
        });


    });
});