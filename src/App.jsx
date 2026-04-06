import { useSelector } from "react-redux";
import { selectActiveTab } from "./store/slices/uiSlice";
import { Header, ViewerBanner } from "./components/layout/Header";
import { OverviewTab }     from "./components/overview/OverviewTab";
import { TransactionsTab } from "./components/transactions/TransactionsTab";
import { InsightsTab }     from "./components/insights/InsightsTab";

function TabContent() {
  const tab = useSelector(selectActiveTab);
  if (tab === "transactions") return <TransactionsTab />;
  if (tab === "insights")     return <InsightsTab />;
  return <OverviewTab />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Header />
      <ViewerBanner />
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-7">
        <TabContent />
      </main>
    </div>
  );
}
