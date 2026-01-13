import { FynixTopBar } from "@/components/features/dashboard/FynixTopBar";
import { HeroBalanceCard } from "@/components/features/dashboard/NetWorthCard";
import { KPIGridFynix } from "@/components/features/dashboard/KPIGridBento";
import { CryptoFiatSection } from "@/components/features/dashboard/CryptoFiatSection";
import { NetWorthDonutFynix } from "@/components/features/dashboard/NetWorthDonut";
import { BalanceCardsFynix } from "@/components/features/dashboard/BalanceCardsWidget";
import { CashflowChartFynix } from "@/components/features/dashboard/CashflowChartBento";
import { RecentTransactionsFynix } from "@/components/features/dashboard/RecentTransactionsBento";
import { BudgetAlerts } from "@/components/features/dashboard/BudgetAlerts";

export default function DashboardPage() {
    return (
        <>
            {/* Top Bar */}
            <FynixTopBar />

            {/* Budget Alerts (if any) */}
            <div className="px-6">
                <BudgetAlerts />
            </div>

            {/* Main Content Grid */}
            <main className="p-6">
                {/* Row 1: Hero + KPI Grid */}
                <div className="grid grid-cols-12 gap-5 mb-5">
                    {/* Hero Balance Card */}
                    <div className="col-span-5">
                        <HeroBalanceCard />
                    </div>

                    {/* KPI Grid (4 cards) */}
                    <div className="col-span-7">
                        <KPIGridFynix />
                    </div>
                </div>

                {/* Row 2: Crypto + Net Worth */}
                <div className="grid grid-cols-12 gap-5 mb-5">
                    {/* Crypto/Fiat Section */}
                    <div className="col-span-5">
                        <CryptoFiatSection />
                    </div>

                    {/* Net Worth Donut */}
                    <div className="col-span-7">
                        <NetWorthDonutFynix />
                    </div>
                </div>

                {/* Row 3: Balance Cards + Recent Transactions */}
                <div className="grid grid-cols-12 gap-5 mb-5">
                    {/* Balance Cards */}
                    <div className="col-span-5">
                        <BalanceCardsFynix />
                    </div>

                    {/* Recent Transactions */}
                    <div className="col-span-7">
                        <RecentTransactionsFynix />
                    </div>
                </div>

                {/* Row 4: Cashflow Chart (Full Width) */}
                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12">
                        <CashflowChartFynix />
                    </div>
                </div>
            </main>
        </>
    );
}
