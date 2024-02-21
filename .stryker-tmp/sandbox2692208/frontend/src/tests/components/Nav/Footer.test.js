import { render, screen } from "@testing-library/react";
import Footer from "main/components/Nav/Footer";

describe("Footer tests", () => {
    test("renders correctly", async () => {
        render(
            <Footer />
        );
        await screen.findByText(/This is a sample webapp using React with a Spring Boot backend./);
    });
});


