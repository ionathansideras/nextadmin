"use server";

import db from "@/DBConfig"; // Import your MySQL database connection
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
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

    // Extract images from the formData
    const images = [];
    for (let i = 0; i < 10; i++) {
        const file = formData.get(`images-${i}`);
        console.log("File received:", file);
        if (file.size > 0) {
            images.push(file);
        }
    }

    // Prepare directory for storing images
    const mediaFolder = path.join(process.cwd(), "public", "media");
    if (!fs.existsSync(mediaFolder)) {
        fs.mkdirSync(mediaFolder, { recursive: true });
    }

    const imagePaths = [];
    for (const image of images) {
        const uniqueId = uuidv4(); // Generate a unique ID
        const fileExtension = path.extname(image.name); // Get the file extension
        const fileName = `${Date.now()}-${uniqueId}${fileExtension}`; // Add timestamp + UUID
        const filePath = path.join(mediaFolder, fileName);

        // Read the file as a buffer and write to the filesystem
        const buffer = Buffer.from(await image.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        imagePaths.push(`/media/${fileName}`);
    }

    try {
        // Insert property details into the database
        const [propertyResult] = await db.query(
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

        const propertyId = propertyResult.insertId;
        console.log("New property added:", propertyId);

        // Insert image URLs into the media table with foreign key
        for (const imagePath of imagePaths) {
            await db.query(
                `INSERT INTO media (property_id, image_url) VALUES (?, ?)`,
                [propertyId, imagePath]
            );
        }

        console.log("Images saved in media table:", imagePaths);
    } catch (err) {
        console.error("Error adding property or media:", err.message);
        throw new Error("Failed to create property and save media!");
    }

    // Revalidate and redirect
    revalidatePath("/dashboard/properties");
    redirect("/dashboard/properties");
};
export const updateProperty = async (formData) => {
    // Extract property details from formData
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

    // Initialize structures to track images
    const images = [];
    const slotsGrid = {};

    // Process formData to extract images and slots-grid
    for (let [key, value] of formData.entries()) {
        if (key.startsWith("images-")) {
            const index = parseInt(key.split("-")[1], 10);
            const file = value;
            if (file && file.size > 0) {
                images.push({ file, index });
            }
        } else if (key.startsWith("slots-grid-")) {
            const index = parseInt(key.split("-")[2], 10);
            slotsGrid[index] = value; // Could be URL, file name, or empty string
        }
    }

    // Prepare directory for storing images
    const mediaFolder = path.join(process.cwd(), "public", "media");
    if (!fs.existsSync(mediaFolder)) {
        fs.mkdirSync(mediaFolder, { recursive: true });
    }

    try {
        // Fetch existing images for the property
        const [existingMedia] = await db.query(
            `SELECT id, image_url FROM media WHERE property_id = ? ORDER BY id ASC`,
            [id]
        );

        // Map existing media by index
        const existingMediaByIndex = {};
        existingMedia.forEach((media, idx) => {
            existingMediaByIndex[idx] = media;
        });

        // Update property details if necessary
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

        const updates = Object.entries(fieldsToUpdate)
            .filter(([, value]) => value !== "" && value !== undefined)
            .map(([key]) => `${key} = ?`)
            .join(", ");

        const values = Object.values(fieldsToUpdate).filter(
            (value) => value !== "" && value !== undefined
        );

        if (updates.length > 0) {
            await db.query(`UPDATE properties SET ${updates} WHERE id = ?`, [
                ...values,
                id,
            ]);
            console.log("Property details updated:", id);
        }

        // Determine which existing images to delete
        for (let index in existingMediaByIndex) {
            index = parseInt(index, 10);
            if (!slotsGrid.hasOwnProperty(index) || slotsGrid[index] === "") {
                // Delete image
                const mediaToDelete = existingMediaByIndex[index];
                const filePath = path.join(
                    process.cwd(),
                    "public",
                    mediaToDelete.image_url
                );

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

                await db.query(`DELETE FROM media WHERE id = ?`, [
                    mediaToDelete.id,
                ]);
                console.log(
                    `Deleted image at slot ${index}: ${mediaToDelete.image_url}`
                );
            }
        }

        // Process new images
        for (const { file, index } of images) {
            const uniqueId = uuidv4();
            const fileExtension = path.extname(file.name);
            const fileName = `${Date.now()}-${uniqueId}${fileExtension}`;
            const filePath = path.join(mediaFolder, fileName);

            const buffer = Buffer.from(await file.arrayBuffer());
            fs.writeFileSync(filePath, buffer);

            const imageUrl = `/media/${fileName}`;

            if (existingMediaByIndex[index]) {
                // Replace existing image
                await db.query(`UPDATE media SET image_url = ? WHERE id = ?`, [
                    imageUrl,
                    existingMediaByIndex[index].id,
                ]);
                console.log(`Replaced image at slot ${index}: ${imageUrl}`);
            } else {
                // Insert new image
                await db.query(
                    `INSERT INTO media (property_id, image_url) VALUES (?, ?)`,
                    [id, imageUrl]
                );
                console.log(`Added new image at slot ${index}: ${imageUrl}`);
            }
        }
    } catch (err) {
        console.error("Error updating property:", err.message);
        throw new Error("Failed to update property!");
    }

    // Revalidate and redirect
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
        // Fetch associated media entries from the database
        const [mediaEntries] = await db.query(
            `SELECT image_url FROM media WHERE property_id = ?`,
            [id]
        );

        if (mediaEntries.length > 0) {
            // Delete the associated files from the media folder
            for (const { image_url } of mediaEntries) {
                const filePath = path.join(process.cwd(), image_url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log("Deleted file:", filePath);
                }
            }

            // Delete the associated media entries from the media table
            await db.query(`DELETE FROM media WHERE property_id = ?`, [id]);
        }

        // Delete the property from the database
        await db.query(`DELETE FROM properties WHERE id = ?`, [id]);

        console.log("Property and associated media deleted:", id);
    } catch (err) {
        console.error(
            "Error deleting Property or associated media:",
            err.message
        );
        throw new Error("Failed to delete Property and associated media!");
    }

    // Revalidate the path to update the UI
    revalidatePath("/dashboard/properties");
};
