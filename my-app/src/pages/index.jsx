import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";



export default function Home() {

  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with Friends without Exaggeration</p>
            <p>A true social media platform,with all the features you need to stay connected with your friends and family.</p>
            <div className={styles.buttonJoin} onClick={() => {
              router.push("/login")
            }}>
              <p>Join Now</p>
            </div>

          </div>
          <div className={styles.mainContainer_right}>
            <img src="/images/homemain_connection.jpg" alt="" />

          </div>
        </div>
      </div>
    </UserLayout>
  );
}
