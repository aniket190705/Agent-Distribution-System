import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddAgent from "./AddAgent";
import AgentList from "./AgentList";
import FileUpload from "./FileUpload";
import DistributionView from "./DistributionView";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("agents");
  const { user, logout } = useAuth();

  const tabs = [
    { id: "agents", name: "Agents", icon: "👥" },
    { id: "upload", name: "Upload & Distribute", icon: "📤" },
    { id: "distributions", name: "View Distributions", icon: "📊" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "agents":
        return (
          <div className="space-y-6">
            <AddAgent />
            <AgentList />
          </div>
        );
      case "upload":
        return <FileUpload />;
      case "distributions":
        return <DistributionView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Agent Distribution System
              </h1>
              <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
