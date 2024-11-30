import { updateProperty } from "@/app/lib/actions";
import { fetchProperty } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/products/singleProduct/singleProduct.module.css";

const SingleProductPage = async ({ params }) => {
    const { id } = params;
    const product = await fetchProperty(id);

    // Ensure product data is available
    if (!product) {
        return (
            <div className={styles.container}>
                <p>Property not found.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form action={updateProperty} className={styles.form}>
                    {/* Hidden ID Field */}
                    <input type="hidden" name="id" value={product.id} />

                    {/* Title */}
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={product.title}
                        required
                    />

                    {/* Price */}
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        defaultValue={product.price}
                        required
                    />

                    {/* Location */}
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        defaultValue={product.location || ""}
                        required
                    />

                    {/* User */}
                    <label htmlFor="user">User</label>
                    <input
                        type="text"
                        id="user"
                        name="user"
                        defaultValue={product.user || ""}
                        required
                        disabled
                        style={{ backgroundColor: "rgba(0,0,0,0)" }}
                    />

                    {/* Address */}
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        defaultValue={product.address || ""}
                        required
                    />

                    {/* Zipcode */}
                    <label htmlFor="zipcode">Zip Code</label>
                    <input
                        type="text"
                        id="zipcode"
                        name="zipcode"
                        defaultValue={product.zipcode || ""}
                        required
                    />

                    {/* Rooms */}
                    <label htmlFor="rooms">Rooms</label>
                    <input
                        type="number"
                        id="rooms"
                        name="rooms"
                        defaultValue={product.rooms}
                        min="1"
                        required
                    />

                    {/* Baths */}
                    <label htmlFor="baths">Baths</label>
                    <input
                        type="number"
                        id="baths"
                        name="baths"
                        defaultValue={product.baths}
                        min="1"
                        required
                    />

                    {/* Square Meters */}
                    <label htmlFor="sqm">Square Meters (sqm)</label>
                    <input
                        type="number"
                        id="sqm"
                        name="sqm"
                        defaultValue={product.sqm}
                        min="1"
                        required
                    />

                    {/* Description */}
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="10"
                        defaultValue={product.description || ""}
                    ></textarea>

                    {/* Submit Button */}
                    <button type="submit">Update Property</button>
                </form>
            </div>
        </div>
    );
};

export default SingleProductPage;
