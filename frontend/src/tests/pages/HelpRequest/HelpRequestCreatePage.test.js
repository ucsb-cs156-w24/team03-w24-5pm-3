import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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

describe("HelpRequestCreatePage tests", () => {

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
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /helprequest", async () => {

        const queryClient = new QueryClient();
        const helpRequest = {
            id: 1,
            requesterEmail: "bendover@ucsb.edu",
            teamId: "s22-5pm-3",
            tableOrBreakoutRoom: "7",
            requestTime: "2022-01-02T12:00:00",
            explanation: "Need help with Swagger-ui",
            solved: false
        };

        axiosMock.onPost("/api/helprequests/post").reply(202, helpRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
        });

        const requesterEmailInput = screen.getByLabelText("Requester Email");
        expect(requesterEmailInput).toBeInTheDocument();

        const teamIdInput = screen.getByLabelText("Team ID");
        expect(teamIdInput).toBeInTheDocument();

        const tableOrBreakoutRoomInput = screen.getByLabelText("Table or Breakout Room");
        expect(tableOrBreakoutRoomInput).toBeInTheDocument();

        const requestTimeInput = screen.getByLabelText("Request Time (iso format)");
        expect(requestTimeInput).toBeInTheDocument();

        const explanationInput = screen.getByLabelText("Explanation");
        expect(explanationInput).toBeInTheDocument();

        const solvedInput = screen.getByLabelText("Solved");
        expect(solvedInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(requesterEmailInput, { target: { value: 'bendover@ucsb.edu' } })
        fireEvent.change(teamIdInput, { target: { value: 's22-5pm-3' } })
        fireEvent.change(tableOrBreakoutRoomInput, { target: { value: '7' } })
        fireEvent.change(requestTimeInput, { target: { value: '2022-01-02T12:00:00' } })
        fireEvent.change(explanationInput, { target: { value: 'Need help with Swagger-ui' } })
        fireEvent.change(solvedInput, { target: { value: false } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            requesterEmail: "bendover@ucsb.edu",
            teamId: "s22-5pm-3",
            tableOrBreakoutRoom: "7",
            explanation: "Need help with Swagger-ui",
            requestTime: "2022-01-02T12:00",
            solved: false
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New Help Request Created - id: 1 requesterEmail: bendover@ucsb.edu teamId: s22-5pm-3 tableOrBreakoutRoom: 7 requestTime: 2022-01-02T12:00:00 explanation: Need help with Swagger-ui solved: false");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
    });
});

