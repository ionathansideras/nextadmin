import { addProperty } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/products/addProduct/addProduct.module.css";
import { fetchUsers } from "@/app/lib/data";

const AddPropertyPage = async () => {
    const users = await fetchUsers();
    console.log("Users:", users);
    return (
        <div className={styles.container}>
            <form action={addProperty} className={styles.form}>
                {/* Product Details */}
                <input type="text" placeholder="Title" name="title" required />
                <input
                    type="number"
                    placeholder="Price"
                    name="price"
                    required
                />

                {/* New Fields */}
                <input
                    type="text"
                    placeholder="Location"
                    name="location"
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    required
                />
                <input
                    type="text"
                    placeholder="Zip Code"
                    name="zipcode"
                    required
                />
                <input
                    list="users"
                    name="user_id"
                    placeholder="Search or select a user"
                    required
                />
                <datalist id="users">
                    {users.users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username} ({user.email})
                        </option>
                    ))}
                </datalist>
                <input
                    type="number"
                    placeholder="Rooms"
                    name="rooms"
                    min="1"
                    required
                />
                <input
                    type="number"
                    placeholder="Baths"
                    name="baths"
                    min="1"
                    required
                />
                <input
                    type="number"
                    placeholder="Square Meters (sqm)"
                    name="sqm"
                    min="1"
                    required
                />

                <textarea
                    required
                    name="desc"
                    id="desc"
                    rows="16"
                    placeholder="Description"
                ></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddPropertyPage;
