import db from "@/DBConfig"; // Import your MySQL database connection configuration

export const fetchUsers = async (q, page) => {
    const ITEM_PER_PAGE = 10;
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const offset = ITEM_PER_PAGE * (pageNumber - 1);
    const searchQuery = `%${q || ""}%`;

    try {
        console.log("Fetching users with parameters:", {
            searchQuery,
            pageNumber,
        });

        // Count total users matching the query
        const [countResult] = await db.query(
            "SELECT COUNT(*) as count FROM users WHERE username LIKE ?",
            [searchQuery]
        );
        const count = countResult[0]?.count || 0; // Handle no results case

        if (count === 0) {
            console.log("No users found.");
            return { count, users: [] }; // Return an empty list
        }

        // Fetch paginated users matching the query
        const [users] = await db.query(
            "SELECT * FROM users WHERE username LIKE ? LIMIT ? OFFSET ?",
            [searchQuery, ITEM_PER_PAGE, offset]
        );

        console.log("Fetched users:", { count, users });
        return { count, users };
    } catch (err) {
        console.error("Error fetching users:", err.message, err.stack);
        throw new Error("Failed to fetch users!");
    }
};

export const fetchUser = async (id) => {
    try {
        // Fetch user by ID
        const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
            id,
        ]);
        return users[0]; // Return the first result
    } catch (err) {
        console.error("Error fetching user:", err);
        throw new Error("Failed to fetch user!");
    }
};

export const fetchProducts = async (q, page) => {
    const ITEM_PER_PAGE = 10;
    const offset = ITEM_PER_PAGE * (page - 1);

    try {
        const searchQuery = `%${q}%`;

        // Count total products matching the query
        const [countResult] = await db.query(
            "SELECT COUNT(*) as count FROM products WHERE title LIKE ?",
            [searchQuery]
        );
        const count = countResult[0].count;

        // Fetch paginated products matching the query
        const [products] = await db.query(
            "SELECT * FROM products WHERE title LIKE ? LIMIT ? OFFSET ?",
            [searchQuery, ITEM_PER_PAGE, offset]
        );

        return { count, products };
    } catch (err) {
        console.error("Error fetching products:", err);
        throw new Error("Failed to fetch products!");
    }
};

export const fetchProduct = async (id) => {
    try {
        // Fetch product by ID
        const [products] = await db.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );
        return products[0]; // Return the first result
    } catch (err) {
        console.error("Error fetching product:", err);
        throw new Error("Failed to fetch product!");
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
