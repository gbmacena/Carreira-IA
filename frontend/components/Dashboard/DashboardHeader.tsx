import { LogOut, User } from "lucide-react";
import { User as UserType } from "@/types";

interface DashboardHeaderProps {
  user: UserType;
  onLogout: () => void;
}

export default function DashboardHeader({
  user,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CarreiraAI
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">Olá, {user.name}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all group relative"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
            <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Sair
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
