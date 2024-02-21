import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Recommendation Request");
            expect(screen.queryByTestId("RecommendationRequestForm-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/recommendationrequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "stu17@ucsb.edu",
                professorEmail: "prof17@ucsb.edu",
                explanation: "BS/MS",
                dateRequested: "2022-04-20T00:00",
                dateNeeded: "2022-05-01T00:00",
                done: false
            });
            axiosMock.onPut('/api/recommendationrequest').reply(200, {
                id: 17,
                requesterEmail: "student17@ucsb.edu",
                professorEmail: "professor17@ucsb.edu",
                explanation: "BS/MS Program",
                dateRequested: "2022-05-20T00:00",
                dateNeeded: "2022-06-01T00:00",
                done: true
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const done = screen.getByTestId("RecommendationRequestForm-done")
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("stu17@ucsb.edu");
            expect(professorEmailField).toHaveValue("prof17@ucsb.edu");
            expect(explanation).toHaveValue("BS/MS");
            expect(dateRequested).toHaveValue("2022-04-20T00:00");
            expect(dateNeeded).toHaveValue("2022-05-01T00:00");
            expect(done).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-requesterEmail");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const done = screen.getByTestId("RecommendationRequestForm-done")
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("stu17@ucsb.edu");
            expect(professorEmailField).toHaveValue("prof17@ucsb.edu");
            expect(explanation).toHaveValue("BS/MS");
            expect(dateRequested).toHaveValue("2022-04-20T00:00");
            expect(dateNeeded).toHaveValue("2022-05-01T00:00");
            expect(done).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: 'student17@ucsb.edu' } })
            fireEvent.change(professorEmailField, { target: { value: 'professor17@ucsb.edu' } })
            fireEvent.change(explanation, { target: { value: 'BS/MS Program' } })
            fireEvent.change(dateRequested, { target: { value: '2022-05-20T00:00' } })
            fireEvent.change(dateNeeded, { target: { value: '2022-06-01T00:00' } })
            //fireEvent.change(done, { target: { value: true } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 requesterEmail: student17@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "student17@ucsb.edu",
                professorEmail: "professor17@ucsb.edu",
                explanation: "BS/MS Program",
                dateRequested: "2022-05-20T00:00",
                dateNeeded: "2022-06-01T00:00",
                done: false
            })); // posted object

        });


    });
});


