"use server";

import db from "@/DBConfig"; // Import your MySQL database connection
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Add a new user
export const addUser = async (formData) => {
    const { username, email, password, phone, address, isAdmin, isActive } =
        Object.fromEntries(formData);

    try {
        // Generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Convert booleans to integers for MySQL
        const isAdminInt = isAdmin === true || isAdmin === "true" ? 1 : 0;
        const isActiveInt = isActive === true || isActive === "true" ? 1 : 0;

        // Insert the new user into the database
        await db.query(
            `INSERT INTO users (username, email, password, phone, address, isAdmin, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                username,
                email,
                hashedPassword,
                phone,
                address,
                isAdminInt,
                isActiveInt,
            ]
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
    const { id, username, email, password, phone, address, isAdmin, isActive } =
        Object.fromEntries(formData);

    try {
        // Hash password only if it's provided
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Convert boolean values to integers for MySQL
        const isAdminInt = isAdmin === true || isAdmin === "true" ? 1 : 0;
        const isActiveInt = isActive === true || isActive === "true" ? 1 : 0;

        // Prepare the fields to be updated
        const updateFields = {
            username,
            email,
            password: hashedPassword, // Only include hashed password if it's provided
            phone,
            address,
            isAdmin: isAdminInt,
            isActive: isActiveInt,
        };

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
export const addProduct = async (formData) => {
    const { title, desc, price, stock, color, size } =
        Object.fromEntries(formData);

    try {
        // Insert the new product into the database
        const [result] = await db.query(
            `INSERT INTO products (title, description, price, stock, color, size) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [title, desc, price, stock, color, size]
        );

        console.log("New product added:", result.insertId);
    } catch (err) {
        console.error("Error adding product:", err.message);
        throw new Error("Failed to create product!");
    }

    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
};

// Update a product
export const updateProduct = async (formData) => {
    const { id, title, desc, price, stock, color, size } =
        Object.fromEntries(formData);

    try {
        const fieldsToUpdate = {
            title,
            description: desc,
            price,
            stock,
            color,
            size,
        };

        const updates = Object.entries(fieldsToUpdate)
            .filter(([, value]) => value !== "" && value !== undefined)
            .map(([key]) => `${key} = ?`)
            .join(", ");

        const values = Object.values(fieldsToUpdate).filter(
            (value) => value !== "" && value !== undefined
        );

        // Update the product in the database
        await db.query(`UPDATE products SET ${updates} WHERE id = ?`, [
            ...values,
            id,
        ]);

        console.log("Product updated:", id);
    } catch (err) {
        console.error("Error updating product:", err.message);
        throw new Error("Failed to update product!");
    }

    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
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
export const deleteProduct = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        // Delete the product from the database
        await db.query(`DELETE FROM products WHERE id = ?`, [id]);

        console.log("Product deleted:", id);
    } catch (err) {
        console.error("Error deleting product:", err.message);
        throw new Error("Failed to delete product!");
    }

    revalidatePath("/dashboard/products");
};
