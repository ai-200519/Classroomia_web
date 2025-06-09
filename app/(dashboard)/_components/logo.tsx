import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
    return (
        <Link href="/">
            <Image
                priority={false}
                src="/logo.svg"
                alt="Logo..classroomia"
                width={100}
                height={100}
            />
        </Link>
    );
};