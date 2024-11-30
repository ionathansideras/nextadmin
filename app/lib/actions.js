"use server";

import db from "@/DBConfig"; // Import your MySQL database connection
import bcrypt from "bcrypt";
import fs from "fs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Add a new user
export const addUser = async (formData) => {
    const { username, email, phone, address } = Object.fromEntries(formData);

    try {
        // Generate hashed password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        await db.query(
            `INSERT INTO users (username, email, phone, address) 
             VALUES (?, ?, ?, ?)`,
            [username, email, phone, address]
        );

        console.log("User added successfully!");
    } catch (err) {
        console.error("Error adding user:", err.message);
        throw new Error("Failed to create user!");
    }

    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
};

// Update a user
export const updateUser = async (formData) => {
    const { id, username, email, phone, address } =
        Object.fromEntries(formData);

    try {
        // Hash password only if it's provided
        // let hashedPassword = null;
        // if (password) {
        //     const salt = await bcrypt.genSalt(10);
        //     hashedPassword = await bcrypt.hash(password, salt);
        // }

        // Prepare the fields to be updated
        const updateFields = {
            username,
            email,
            phone,
            address,
        };

        console.log("Updating user:", updateFields);

        // Remove fields with null or undefined values
        Object.keys(updateFields).forEach(
            (key) =>
                (updateFields[key] === "" ||
                    updateFields[key] === undefined ||
                    updateFields[key] === null) &&
                delete updateFields[key]
        );

        // Dynamically build the SQL query for updating
        const setClause = Object.keys(updateFields)
            .map((key) => `${key} = ?`)
            .join(", ");
        const values = [...Object.values(updateFields), id];

        // Update user in the database
        await db.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);

        console.log("User updated successfully!");
    } catch (err) {
        console.error("Error updating user:", err.message);
        throw new Error("Failed to update user!");
    }

    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
};

// Add a new product
export const addProperty = async (formData) => {
    const {
        title,
        desc,
        price,
        location,
        address,
        zipcode,
        user_id,
        rooms,
        baths,
        sqm,
    } = Object.fromEntries(formData);

    console.log(
        "Adding new property:",
        title,
        desc,
        price,
        location,
        address,
        zipcode,
        user_id,
        rooms,
        baths,
        sqm
    );

    try {
        // Insert the new property into the database
        const [result] = await db.query(
            `INSERT INTO properties (title, description, price, location, address, zipcode, user_id, rooms, baths, sqm) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                desc,
                price,
                location,
                address,
                zipcode,
                user_id,
                rooms,
                baths,
                sqm,
            ]
        );

        console.log("New property added:", result.insertId);
    } catch (err) {
        console.error("Error adding property:", err.message);
        throw new Error("Failed to create property!");
    }

    revalidatePath("/dashboard/properties");
    redirect("/dashboard/properties");
};

export const updateProperty = async (formData) => {
    const {
        id,
        title,
        price,
        location,
        address,
        zipcode,
        rooms,
        baths,
        sqm,
        description,
    } = Object.fromEntries(formData);

    try {
        // Create a map of fields to update
        const fieldsToUpdate = {
            title,
            price,
            location,
            address,
            zipcode,
            rooms,
            baths,
            sqm,
            description,
        };

        // Generate the SQL update query dynamically based on provided values
        const updates = Object.entries(fieldsToUpdate)
            .filter(([, value]) => value !== "" && value !== undefined) // Exclude empty or undefined values
            .map(([key]) => `${key} = ?`) // Create key = ? pairs
            .join(", ");

        const values = Object.values(fieldsToUpdate).filter(
            (value) => value !== "" && value !== undefined // Include only non-empty, defined values
        );

        // Ensure at least one field is being updated
        if (updates.length === 0) {
            throw new Error("No fields to update.");
        }

        // Execute the update query
        await db.query(`UPDATE properties SET ${updates} WHERE id = ?`, [
            ...values,
            id,
        ]);

        console.log("Property updated:", id);
    } catch (err) {
        console.error("Error updating property:", err.message);
        throw new Error("Failed to update property!");
    }

    // Revalidate and redirect to the updated page
    revalidatePath("/dashboard/properties");
    redirect("/dashboard/properties");
};

// Delete a user
export const deleteUser = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        // Delete the user from the database
        await db.query(`DELETE FROM users WHERE id = ?`, [id]);

        console.log("User deleted:", id);
    } catch (err) {
        console.error("Error deleting user:", err.message);
        throw new Error("Failed to delete user!");
    }

    revalidatePath("/dashboard/users");
};

// Delete a product
export const deleteProperty = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        // Delete the product from the database
        await db.query(`DELETE FROM properties WHERE id = ?`, [id]);

        console.log("Property deleted:", id);
    } catch (err) {
        console.error("Error deleting Property:", err.message);
        throw new Error("Failed to delete Property!");
    }

    revalidatePath("/dashboard/properties");
};
