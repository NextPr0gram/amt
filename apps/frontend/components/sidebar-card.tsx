import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { protectedFetch } from "@/utils/protected-fetch"
import { useRouter } from "next/navigation"



const SidebarCard = () => {
    const router = useRouter()

    const connectBox = async () => {
        const res = await protectedFetch("/box/connect", "GET")
        router.push(res.data.url)
    }
    return (
        <Card className="shadow-none">
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm">Connect to Box</CardTitle>
                <CardDescription>
                    You need to connect to Box to access all the features of the application
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2.5 p-4">
                <Button
                    onClick={connectBox}
                    className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
                    size="sm"
                >
                    Connect to Box
                </Button>
            </CardContent>
        </Card>
    )
}
export default SidebarCard

