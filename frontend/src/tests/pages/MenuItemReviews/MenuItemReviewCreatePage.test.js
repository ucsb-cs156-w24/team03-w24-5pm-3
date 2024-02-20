import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReviews/MenuItemReviewCreatePage";
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

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("Renders without crashing", () => {
        // arrange
        setupUserOnly();
        const queryClient = new QueryClient();
       
        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {

        setupUserOnly();
        const queryClient = new QueryClient();
        const menuItemReview = {
            id: 1,
            itemId: 11,
            reviewerEmail: "sophiattran@ucsb.edu",
            stars: 2,
            dateReviewed: "2022-01-03T00:00",
            comments: "this kinda sucked"
        };

        axiosMock.onPost("/api/menuitemreviews/post").reply(202, menuItemReview);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Menu Item ID")).toBeInTheDocument();
        });

        const itemIdInput = screen.getByLabelText("Menu Item ID");
        expect(itemIdInput).toBeInTheDocument();

        const reviewerEmailInput = screen.getByLabelText("Email");
        expect(reviewerEmailInput).toBeInTheDocument();

        const starsInput = screen.getByLabelText("Stars");
        expect(starsInput).toBeInTheDocument();

        const dateReviewedInput = screen.getByLabelText("Date (iso format)");
        expect(dateReviewedInput).toBeInTheDocument();

        const commentsInput = screen.getByLabelText("Comments");
        expect(commentsInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(itemIdInput, { target: { value: '11' } })
        fireEvent.change(reviewerEmailInput, { target: { value: 'sophiattran@ucsb.edu' } })
        fireEvent.change(starsInput, { target: { value: '2' } })
        fireEvent.change(dateReviewedInput, { target: { value: '2022-01-03T00:00' } })
        fireEvent.change(commentsInput, { target: { value: 'this kinda sucked' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            itemId: "11",
            reviewerEmail: "sophiattran@ucsb.edu",
            stars: "2",
            dateReviewed: "2022-01-03T00:00",
            comments: "this kinda sucked"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New review Created - id: 1 itemId: 11 stars: 2");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });

    });

});

