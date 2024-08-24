import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getToken } from "./auth";

function ViewMembers() {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page
    const [searchTerm, setSearchTerm] = useState("");
    const [projectFilter, setProjectFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const token = getToken();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                if (!token) throw new Error('No token found');

                const response = await fetch('/users?role=member', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMembers(data);
                    setFilteredMembers(data); // Initialize filtered members
                } else {
                    throw new Error('Failed to fetch members');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchMembers();
    }, [token]);

    useEffect(() => {
        let updatedMembers = members.filter(member =>
            member.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (projectFilter === "least_projects") {
            updatedMembers = updatedMembers.sort((a, b) => a.tasks_assigned.length - b.tasks_assigned.length);
        } else if (projectFilter === "no_projects") {
            updatedMembers = updatedMembers.filter(member => member.tasks_assigned.length === 0);
        }

        if (statusFilter === "active") {
            updatedMembers = updatedMembers.filter(member => member.member_status === "active");
        }

        setFilteredMembers(updatedMembers);
    }, [searchTerm, projectFilter, statusFilter, members]);

    // Get the current members for the current page
    const indexOfLastMember = currentPage * itemsPerPage;
    const indexOfFirstMember = indexOfLastMember - itemsPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

    // Pagination logic
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex h-screen bg-gray-800 dark:bg-gray-900 overflow-hidden">
            <Sidebar />
            <div className="flex-1 p-6 overflow-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Members</h1>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-4">
                    <input 
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full"
                    />
                </div>
                <div className="mb-4 flex gap-4">
                    <select 
                        value={projectFilter}
                        onChange={(e) => setProjectFilter(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                        <option value="all">All Members</option>
                        <option value="least_projects">Least Projects</option>
                        <option value="no_projects">No Projects</option>
                    </select>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tasks Assigned</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {currentMembers.map(member => (
                                <tr key={member.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{member.full_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{member.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{member.tasks_assigned.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{member.member_status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewMembers;
