import { addProperty } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/products/addProduct/addProduct.module.css";
import { fetchUsers } from "@/app/lib/data";
import ImageSlots from "@/app/ui/dashboard/products/ImageSlots";
import FilterDropDown from "@/app/ui/dashboard/FilterDropDown";

const AddPropertyPage = async () => {
    const users = await fetchUsers();

    return (
        <div className={styles.container}>
            <form
                action={addProperty}
                className={styles.form}
                id="add-property-form"
            >
                {/* Product Details */}
                <input type="text" placeholder="Title" name="title" required />
                <input
                    type="number"
                    placeholder="Price"
                    name="price"
                    required
                />
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
                {/* FilterDropDown Component */}
                <FilterDropDown users={users.users} name="user_id" />

                <textarea
                    required
                    name="desc"
                    id="desc"
                    rows="16"
                    placeholder="Description"
                ></textarea>

                {/* Call the ImageSlots Component */}
                <ImageSlots />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddPropertyPage;
