import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {

        const queryClient = new QueryClient();
        const UCSBOrganization = {
            orgCode: "SKY",
            orgTranslationShort: "SKYDIVING CLUB",
            orgTranslation: "SKYDIVING CLUB AT UCSB",
            inactive: false
        };

        axiosMock.onPost("/api/ucsborganization/post").reply(202, UCSBOrganization);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("UCSBOrganizationForm-orgCode")).toBeInTheDocument();
        });

        const orgCodeInput = screen.getByLabelText("Organization Code");
        expect(orgCodeInput).toBeInTheDocument();

        const orgCodeTranslationShortInput = screen.getByLabelText("Organization Translation Short");
        expect(orgCodeTranslationShortInput).toBeInTheDocument();
        
        const orgCodeTranslationInput = screen.getByLabelText("Organization Translation");
        expect(orgCodeTranslationInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(orgCodeInput, { target: { value: 'SKY' } })
        fireEvent.change(orgCodeTranslationShortInput, { target: { value: 'SKYDIVING CLUB' } })
        fireEvent.change(orgCodeTranslationInput, { target: { value: 'SKYDIVING CLUB AT UCSB' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            orgCode: "SKY",
            orgTranslationShort: "SKYDIVING CLUB",
            orgTranslation: "SKYDIVING CLUB AT UCSB",
            inactive: false
            });


        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New ucsbOrganization Created - ordCode: SKY orgCodeTranslationShort: SKYDIVING CLUB orgTranslation: SKYDIVING CLUB AT UCSB inactive: false");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

    });
});