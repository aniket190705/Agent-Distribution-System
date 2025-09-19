import React, { useState, useEffect } from "react";
import api from "../utils/api";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/agents");
      setAgents(response.data.agents);
      setError("");
    } catch (error) {
      setError("Error fetching agents");
      console.error("Fetch agents error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();

    // Listen for agent added events
    const handleAgentAdded = () => {
      fetchAgents();
    };

    window.addEventListener("agentAdded", handleAgentAdded);

    return () => {
      window.removeEventListener("agentAdded", handleAgentAdded);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Agents List ({agents.length}/5)
        </h2>
        {agents.length < 5 && (
          <p className="text-sm text-amber-600 mt-1">
            You need exactly 5 agents to distribute leads. Currently have{" "}
            {agents.length} agents.
          </p>
        )}
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-100 border-b border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {agents.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Agents Added
          </h3>
          <p className="text-gray-500">
            Add your first agent to get started with lead distribution.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agents.map((agent, index) => (
                <tr
                  key={agent._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {agent.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentList;
