"use client";

import { useState } from "react";
import styles from "./FilterDropDown.module.css"; // Add necessary styles

const FilterDropDown = ({ users, name }) => {
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);

        // Filter users based on the search query
        setFilteredUsers(
            users.filter(
                (user) =>
                    user.username.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query)
            )
        );
    };

    return (
        <div className={styles.dropdownContainer}>
            <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={handleSearch}
                className={styles.searchInput}
            />
            <select name={name} required className={styles.selectInput}>
                <option value="" disabled selected>
                    Select a user
                </option>
                {filteredUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterDropDown;
