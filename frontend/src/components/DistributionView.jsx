import React, { useState, useEffect } from "react";
import api from "../utils/api";

const DistributionView = () => {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedAgent, setExpandedAgent] = useState(null);

  const fetchDistributions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/upload/distributions");
      setDistributions(response.data.distributions);
      setError("");
    } catch (error) {
      setError("Error fetching distributions");
      console.error("Fetch distributions error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributions();
  }, []);

  const toggleExpand = (agentId) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  };

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
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Lead Distributions
          </h2>
          {distributions.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Last updated:{" "}
              {new Date(distributions[0]?.distributionDate).toLocaleString()}
            </p>
          )}
        </div>

        {error && (
          <div className="px-6 py-4 bg-red-100 border-b border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {distributions.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Distributions Found
            </h3>
            <p className="text-gray-500">
              Upload a CSV file to see lead distributions here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {distributions.map((dist) => (
              <div key={dist.agent._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {dist.agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">
                        {dist.agent.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {dist.agent.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {dist.agent.mobile}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-blue-600">
                        {dist.leadsCount}
                      </div>
                      <div className="text-sm text-gray-500">
                        leads assigned
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(dist.agent._id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      {expandedAgent === dist.agent._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>
                </div>

                {/* Expanded lead details */}
                {expandedAgent === dist.agent._id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Assigned Leads:
                    </h4>
                    {dist.leads.length === 0 ? (
                      <p className="text-gray-500 italic">No leads assigned</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                First Name
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Notes
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {dist.leads.map((lead, index) => (
                              <tr
                                key={index}
                                className={
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                              >
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {index + 1}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {lead.firstName}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {lead.phone}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                  {lead.notes || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionView;
