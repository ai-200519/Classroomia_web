import Image from "next/image";

export const Logo = () => {
        return (
            <Image
                priority={false}
                src="/logo.svg"
                alt="Logo..classroomia"
                width={100}
                height={100}
            />
        );
    };