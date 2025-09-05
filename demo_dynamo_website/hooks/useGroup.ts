import { useState, useEffect } from "react";
import axios from "axios";
import { Group, CreateGroupData, UpdateGroupData } from "@/lib/type";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useGroups() {
    const [data, setData] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await axios.get<Group[]>(`${API_URL}/api/group`);
            setData(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch groups");
            console.error("Error fetching groups:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const refetch = () => {
        fetchGroups();
    };

    return { data, loading, error, refetch };
}

export function useGroupById(groupId: string | null) {
    const [data, setData] = useState<Group | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!groupId) return;

        const fetchGroup = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Group>(`${API_URL}/api/group/${groupId}`);
                setData(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch group details");
                console.error("Error fetching group:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroup();
    }, [groupId]);

    return { data, loading, error };
}

export function useGroupMutations() {
    const [loading, setLoading] = useState(false);

    const createGroup = async (groupData: CreateGroupData): Promise<Group> => {
        setLoading(true);
        try {
            const response = await axios.post<Group>(`${API_URL}/api/group`, groupData);
            return response.data;
        } catch (error) {
            console.error("Error creating group:", error);
            throw new Error("Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    const updateGroup = async (groupId: string, groupData: UpdateGroupData): Promise<Group> => {
        setLoading(true);
        try {
            const response = await axios.put<Group>(`${API_URL}/api/group/${groupId}`, groupData);
            return response.data;
        } catch (error) {
            console.error("Error updating group:", error);
            throw new Error("Failed to update group");
        } finally {
            setLoading(false);
        }
    };

    const deleteGroup = async (groupId: string): Promise<void> => {
        setLoading(true);
        try {
            // Note: The API endpoint should be /api/group/{groupId}, not /api/machine/{machine_id}
            await axios.delete(`${API_URL}/api/group/${groupId}`);
        } catch (error) {
            console.error("Error deleting group:", error);
            throw new Error("Failed to delete group");
        } finally {
            setLoading(false);
        }
    };

    return {
        createGroup,
        updateGroup,
        deleteGroup,
        loading
    };
}
