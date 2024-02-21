import MenuItemReviewEditPage from "main/pages/MenuItemReviews/MenuItemReviewEditPage";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReview");
            expect(screen.queryByTestId("MenuItemReview-itemId")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 17 } }).reply(200, {
                id: 17,
                itemId: "32",
                reviewerEmail: "test1@ucsb.edu",
                stars: "3",
                dateReviewed: "2022-01-03T00:00",
                comments: "most mid ever"
            });
            axiosMock.onPut('/api/menuitemreviews').reply(200, {
                id: "17",
                itemId: "35",
                reviewerEmail: "test2@ucsb.edu",
                stars: "2",
                dateReviewed: "2022-01-25T00:00",
                comments: "hated it"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(itemIdField).toBeInTheDocument();
            expect(itemIdField).toHaveValue(32);
            expect(reviewerEmailField).toBeInTheDocument();
            expect(reviewerEmailField).toHaveValue("test1@ucsb.edu");
            expect(starsField).toBeInTheDocument();
            expect(starsField).toHaveValue(3);
            expect(dateReviewedField).toBeInTheDocument();
            expect(dateReviewedField).toHaveValue("2022-01-03T00:00");
            expect(commentsField).toBeInTheDocument();
            expect(commentsField).toHaveValue("most mid ever");

            expect(submitButton).toHaveTextContent("Update");
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(itemIdField).toBeInTheDocument();
            expect(itemIdField).toHaveValue(32);
            expect(reviewerEmailField).toBeInTheDocument();
            expect(reviewerEmailField).toHaveValue("test1@ucsb.edu");
            expect(starsField).toBeInTheDocument();
            expect(starsField).toHaveValue(3);
            expect(dateReviewedField).toBeInTheDocument();
            expect(dateReviewedField).toHaveValue("2022-01-03T00:00");
            expect(commentsField).toBeInTheDocument();
            expect(commentsField).toHaveValue("most mid ever");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(itemIdField, { target: { value: '35' } });
            fireEvent.change(reviewerEmailField, { target: { value: 'test2@ucsb.edu' } });
            fireEvent.change(starsField, { target: { value: '2' } });
            fireEvent.change(dateReviewedField, { target: { value: '2022-01-25T00:00' } });
            fireEvent.change(commentsField, { target: { value: 'hated it' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: 17 itemId: 35 stars: 2");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: '35',
                reviewerEmail: 'test2@ucsb.edu',
                stars: '2',
                dateReviewed: '2022-01-25T00:00',
                comments: 'hated it'
                })); // posted object
        });

    });

});


