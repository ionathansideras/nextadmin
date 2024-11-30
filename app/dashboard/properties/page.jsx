import Image from "next/image";
import Link from "next/link";
import styles from "@/app/ui/dashboard/products/products.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import { fetchProperties } from "@/app/lib/data";
import { deleteProperty } from "@/app/lib/actions";
import DeleteButton from "@/app/ui/dashboard/DeleteButton";

const ProductsPage = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;

    // Fetch products (properties)
    const { count, products } = await fetchProperties(q, page);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Search placeholder="Search for a property..." />
                <Link href="/dashboard/properties/add">
                    <button className={styles.addButton}>Add New</button>
                </Link>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Title</td>
                        <td>Owner</td>
                        <td>Location</td>
                        <td>Timestamp</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>
                                <div className={styles.product}>
                                    {product.title}
                                </div>
                            </td>
                            <td>{product.ownerName || "N/A"}</td>
                            <td>{product.location || "N/A"}</td>
                            <td>
                                {new Date(product.createdAt).toLocaleString()}
                            </td>
                            <td>
                                <div className={styles.buttons}>
                                    <Link
                                        href={`/dashboard/properties/${product.id}`}
                                    >
                                        <button
                                            className={`${styles.button} ${styles.view}`}
                                        >
                                            View
                                        </button>
                                    </Link>
                                    <form action={deleteProperty}>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={product.id}
                                        />
                                        <DeleteButton />
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination count={count} />
        </div>
    );
};

export default ProductsPage;
