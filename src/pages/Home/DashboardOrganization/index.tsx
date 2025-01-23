import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { StatisticsCard } from "../../../components/StatisticsCard";
import { DashboardCard } from "../../../services/dashboardTypes";
import { useDashboard } from "../../../hooks/useDashboard";
import { Layout } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardOrganization = () => {
  const { state, updateCard } = useDashboard();

  const onLayoutChange = (layout: Layout[]) => {
    const newCards = state.cards.map(card => ({
      ...card,
      layout: {
        lg: layout.find(l => l.i === card.id) || card.layout.lg,
        md:
          layout.find(l => l.i === card.id) || card.layout.md || card.layout.lg,
        sm:
          layout.find(l => l.i === card.id) || card.layout.sm || card.layout.lg,
        xs:
          layout.find(l => l.i === card.id) || card.layout.xs || card.layout.lg,
      },
    }));

    newCards.forEach(card => {
      updateCard(card.id, { layout: card.layout });
    });
  };

  const layouts = {
    lg: state.cards.map(card => ({ ...card.layout.lg, i: card.id })),
    md: state.cards.map(card => ({
      ...(card.layout.md || card.layout.lg),
      i: card.id,
    })),
    sm: state.cards.map(card => ({
      ...(card.layout.sm || card.layout.lg),
      i: card.id,
    })),
    xs: state.cards.map(card => ({
      ...(card.layout.xs || card.layout.lg),
      i: card.id,
    })),
  };

  return (
    <div className="p-6">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 8, sm: 12, xs: 12 }}
        rowHeight={120}
        onLayoutChange={onLayoutChange}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
      >
        {state.cards.map((card: DashboardCard) => (
          <div key={card.id} className="bg-white rounded-lg shadow-sm">
            <StatisticsCard
              id={card.id}
              title={card.title}
              analyticType={card.analyticType}
              displayType={card.displayType}
              timeRange={card.timeRange}
              className="h-full"
              onUpdateCard={updates => updateCard(card.id, updates)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardOrganization;
