"use client";
import React from "react";
import styles from "@/app/ui/dashboard/products/products.module.css";

export default function DeleteButton() {
    const handleDelete = (e) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this?"
        );
        if (!confirmed) {
            e.preventDefault();
        }
    };

    return (
        <button
            className={`${styles.button} ${styles.delete}`}
            onClick={handleDelete}
        >
            Delete
        </button>
    );
}
