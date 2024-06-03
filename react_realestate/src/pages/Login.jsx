import { useDisclosure } from "@nextui-org/react";
import LoginModal from '../components/Login/LoginModal'

export default function Index() {
    const { onOpenChange } = useDisclosure();
    return (
        <>
            <LoginModal isOpen={true} onOpenChange={onOpenChange} />
        </>
    );
}