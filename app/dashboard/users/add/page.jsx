import { addUser } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/users/addUser/addUser.module.css";

const AddUserPage = () => {
    return (
        <div className={styles.container}>
            <form action={addUser} className={styles.form}>
                <input
                    type="text"
                    placeholder="username"
                    name="username"
                    required
                />
                <input type="email" placeholder="email" name="email" required />

                <input type="phone" placeholder="phone" name="phone" />

                <input type="text" name="address" placeholder="Address"></input>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddUserPage;
