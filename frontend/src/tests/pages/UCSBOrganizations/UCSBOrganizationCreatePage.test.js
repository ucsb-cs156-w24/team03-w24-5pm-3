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

    test("on submit, makes request to backend, and redirects to /UCSBOrganization", async () => {

        const queryClient = new QueryClient();
        const organization = {
            orgCode: "OSLI",
            orgTranslationShort: "STUDENT LIFE",
            orgTranslation: "OFFICE OF STUDENT LIFE",
            inactive: false
        };

        axiosMock.onPost("/api/UCSBOrganization/post").reply(202, organization);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Organization Code")).toBeInTheDocument();
        });

        const orgCodeInput = screen.getByLabelText("Organization Code");
        expect(orgCodeInput).toBeInTheDocument();

        const orgTranslationShortInput = screen.getByLabelText("Organization Translation (short)");
        expect(orgTranslationShortInput).toBeInTheDocument();

        const orgTranslationInput = screen.getByLabelText("Organization Translation");
        expect(orgTranslationInput).toBeInTheDocument();

        const inactiveInput = screen.getByLabelText("Inactive");
        expect(inactiveInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(orgCodeInput, { target: { value: 'OSLI' } })
        fireEvent.change(orgTranslationShortInput, { target: { value: 'STUDENT LIFE' } })
        fireEvent.change(orgTranslationInput, { target: { value: 'OFFICE OF STUDENT LIFE' } })
        fireEvent.click(inactiveInput);
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            orgCode: "OSLI",
            orgTranslationShort: "STUDENT LIFE",
            orgTranslation: "OFFICE OF STUDENT LIFE",
            inactive: true

        });

        expect(mockToast).toBeCalledWith("New organization Created - orgCode: OSLI");
        expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganization" });

    });
});

