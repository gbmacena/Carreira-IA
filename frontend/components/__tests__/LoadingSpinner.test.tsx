import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders loading spinner and text", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("CarreiraAI")).toBeInTheDocument();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });
});
