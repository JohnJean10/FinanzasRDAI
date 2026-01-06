import { ChatInterface } from "@/components/features/coach/ChatInterface";
import { CoachSidebar } from "@/components/features/coach/CoachSidebar";

export default function CoachPage() {
    return (
        <div className="p-6 h-screen overflow-hidden">
            <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">

                {/* Sidebar - Hidden on mobile initially (TODO: Drawer) */}
                <div className="hidden lg:block h-full overflow-hidden">
                    <CoachSidebar />
                </div>

                {/* Main Chat Area */}
                <div className="h-full">
                    <ChatInterface />
                </div>

            </div>
        </div>
    );
}
