import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { StatisticsCard } from "../../../components/StatisticsCard";
import { GridLayouts } from "../../../services/dashboardTypes";
import { useDashboard } from "../../../hooks/useDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@store";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardOrganization = () => {
  const organizationId = useSelector(
    (state: RootState) => state.auth.selectOrganizationId
  );
  const { state, loading, updateCard, updateLayouts } =
    useDashboard(organizationId);

  const layouts: GridLayouts = {
    lg: state.map(card => ({ ...card.layout.lg, i: String(card.id) })),
    md: state.map(card => ({
      ...(card.layout.md || card.layout.lg),
      i: String(card.id),
    })),
    sm: state.map(card => ({
      ...(card.layout.sm || card.layout.lg),
      i: String(card.id),
    })),
    xs: state.map(card => ({
      ...(card.layout.xs || card.layout.lg),
      i: String(card.id),
    })),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ResponsiveGridLayout
        className="layout"
        // @ts-expect-error - Los tipos de @types/react-grid-layout están desactualizados respecto a la versión actual del paquete
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 36, md: 30, sm: 18, xs: 12 }}
        rowHeight={30}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        compactType="vertical"
        useCSSTransforms
        // @ts-expect-error - Los tipos de @types/react-grid-layout están desactualizados respecto a la versión actual del paquete
        onLayoutChange={(_, allLayouts) => updateLayouts(allLayouts)}
      >
        {state.map(card => (
          <div key={String(card.id)}>
            <StatisticsCard
              id={card.id}
              title={card.title}
              analyticTypes={card.analyticTypes}
              displayType={card.displayType}
              timeRange={card.timeRange}
              className="h-full"
              showLegend={card.showLegend}
              onUpdateCard={updates => updateCard(card.id, updates)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardOrganization;
