import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ViewProfileIndex() {
    const router = useRouter();

    useEffect(() => {
        router.push("/discover");
    }, [router]);

    return null;
}
