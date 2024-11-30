import { updateUser } from "@/app/lib/actions";
import { fetchUser } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/users/singleUser/singleUser.module.css";
import Link from "next/link";

const SingleUserPage = async ({ params }) => {
    const { id } = params;
    const user = await fetchUser(id);

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form action={updateUser} className={styles.form}>
                    {/* Hidden ID Field */}
                    <input type="hidden" name="id" value={user.id} />
                    {/* Username */}
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        defaultValue={user.username}
                        placeholder={user.username}
                        required
                    />
                    {/* Email */}
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={user.email}
                        placeholder={user.email}
                        required
                    />
                    {/* Phone */}
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        defaultValue={user.phone || ""}
                        placeholder={user.phone || ""}
                    />
                    {/* Address */}
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        defaultValue={user.address || ""}
                        placeholder={user.address || ""}
                    />
                    {/* Update Button */}
                    <button type="submit">Update</button>
                </form>
            </div>
            <div className={styles.formContainerSmall}>
                <h2>Assigned Properties</h2>
                {user.properties.length > 0 ? (
                    <table className={styles.tableStyles}>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Price</td>
                            </tr>
                        </thead>
                        <tbody>
                            {user.properties.map((property, index) => (
                                <tr
                                    key={property.id}
                                    style={{
                                        backgroundColor:
                                            index % 2 === 0
                                                ? "rgba(210, 210, 210, 0.2)"
                                                : "inherit",
                                    }}
                                >
                                    <td>
                                        <Link
                                            href={`/dashboard/properties/${property.id}`}
                                        >
                                            {property.name}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            href={`/dashboard/properties/${property.id}`}
                                        >
                                            ${property.price}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No properties assigned to this user.</p>
                )}
            </div>
        </div>
    );
};

export default SingleUserPage;
