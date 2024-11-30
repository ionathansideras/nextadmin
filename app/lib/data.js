import db from "@/DBConfig"; // Import your MySQL database connection configuration

export const fetchUsers = async (q, page) => {
    const ITEMS_PER_PAGE = 10;

    try {
        const searchQuery = q ? `%${q}%` : null; // Handle optional search query

        // If no page is provided, fetch all users without pagination
        if (!page) {
            const [users] = await db.query(
                `
                SELECT id, username, email, phone
                FROM users
                ${searchQuery ? "WHERE username LIKE ? OR email LIKE ?" : ""}
                `,
                searchQuery ? [searchQuery, searchQuery] : []
            );

            const count = users.length; // Total count is the number of users fetched
            return { count, users };
        }

        // Ensure page is a valid number for paginated queries
        const pageNumber =
            isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);
        const offset = ITEMS_PER_PAGE * (pageNumber - 1);

        // Count total users matching the query
        const [countResult] = await db.query(
            `
            SELECT COUNT(*) as count
            FROM users
            ${searchQuery ? "WHERE username LIKE ? OR email LIKE ?" : ""}
            `,
            searchQuery ? [searchQuery, searchQuery] : []
        );
        const count = countResult[0]?.count || 0;

        // Fetch paginated users matching the query
        const [users] = await db.query(
            `
            SELECT id, username, email, phone
            FROM users
            ${searchQuery ? "WHERE username LIKE ? OR email LIKE ?" : ""}
            LIMIT ? OFFSET ?
            `,
            searchQuery
                ? [searchQuery, searchQuery, ITEMS_PER_PAGE, offset]
                : [ITEMS_PER_PAGE, offset]
        );

        return { count, users };
    } catch (err) {
        console.error("Error fetching users:", err.message);
        throw new Error("Failed to fetch users!");
    }
};

export const fetchUser = async (id) => {
    try {
        // Fetch user details
        const [userResult] = await db.query(
            `
            SELECT id, username, email, phone, address
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        if (!userResult || userResult.length === 0) {
            throw new Error(`No user found with ID ${id}`);
        }

        const user = userResult[0];

        // Fetch properties assigned to the user
        const [properties] = await db.query(
            `
            SELECT id, title AS name, price
            FROM properties
            WHERE user_id = ?
            `,
            [id]
        );

        return { ...user, properties };
    } catch (err) {
        console.error("Error fetching user:", err.message);
        throw new Error("Failed to fetch user!");
    }
};

export const fetchProperties = async (q, page) => {
    const ITEMS_PER_PAGE = 10;
    const offset = ITEMS_PER_PAGE * (page - 1);

    try {
        const searchQuery = `%${q}%`;

        // Count total properties matching the query
        const [countResult] = await db.query(
            "SELECT COUNT(*) as count FROM properties WHERE title LIKE ?",
            [searchQuery]
        );
        const count = countResult[0]?.count || 0;

        // Fetch paginated properties with owner details
        const [products] = await db.query(
            `SELECT 
                p.id,
                p.title,
                p.location,
                p.created_at AS createdAt,
                u.username AS ownerName
             FROM properties p
             JOIN users u ON p.user_id = u.id
             WHERE p.title LIKE ?
             LIMIT ? OFFSET ?`,
            [searchQuery, ITEMS_PER_PAGE, offset]
        );

        return { count, products };
    } catch (err) {
        console.error("Error fetching properties:", err.message);
        throw new Error("Failed to fetch properties!");
    }
};

export const fetchProperty = async (id) => {
    try {
        // Fetch property details along with user and images
        const [properties] = await db.query(
            `
            SELECT 
                p.id,
                p.title,
                p.price,
                p.location,
                u.username AS user,
                p.address,
                p.zipcode,
                p.rooms,
                p.baths,
                p.sqm,
                p.description,
                p.created_at,
                JSON_ARRAYAGG(m.image_url) AS images
            FROM properties p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN media m ON p.id = m.property_id
            WHERE p.id = ?
            GROUP BY p.id
            `,
            [id]
        );

        // Check if the property exists
        if (!properties || properties.length === 0) {
            throw new Error(`No property found with ID ${id}`);
        }

        return properties[0]; // Return the first result with images
    } catch (err) {
        console.error("Error fetching property:", err.message);
        throw new Error("Failed to fetch property!");
    }
};

// DUMMY DATA
export const cards = [
    {
        id: 1,
        title: "Total Users",
        number: 10.928,
        change: 12,
    },
    {
        id: 2,
        title: "Stock",
        number: 8.236,
        change: -2,
    },
    {
        id: 3,
        title: "Revenue",
        number: 6.642,
        change: 18,
    },
];
