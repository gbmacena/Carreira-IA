import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Mock the hooks
jest.mock("@/context/AuthContext");
jest.mock("next/navigation");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner when loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      login: jest.fn(),
      logout: jest.fn(),
    });
    mockUseRouter.mockReturnValue({ push: jest.fn() } as any);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    const mockPush = jest.fn();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });
    mockUseRouter.mockReturnValue({ push: mockPush } as any);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("renders children when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", email: "test@example.com" },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });
    mockUseRouter.mockReturnValue({ push: jest.fn() } as any);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
