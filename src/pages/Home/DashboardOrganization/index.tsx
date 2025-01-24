import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { StatisticsCard } from "../../../components/StatisticsCard";
import { GridLayout, GridLayouts } from "../../../services/dashboardTypes";
import { useDashboard } from "../../../hooks/useDashboard";

const ResponsiveGridLayout = WidthProvider<GridLayouts>(Responsive);

const DashboardOrganization = () => {
  const { state, updateCard } = useDashboard();

  const onLayoutChange = (
    currentLayout: GridLayout[],
    allLayouts: GridLayouts
  ) => {
    const newCards = state.cards.map(card => ({
      ...card,
      layout: {
        lg: {
          ...(currentLayout.find(l => l.i === String(card.id)) ||
            card.layout.lg),
          i: card.id,
        },
        md: {
          ...(allLayouts.md?.find(l => l.i === String(card.id)) ||
            card.layout.md ||
            card.layout.lg),
          i: card.id,
        },
        sm: {
          ...(allLayouts.sm?.find(l => l.i === String(card.id)) ||
            card.layout.sm ||
            card.layout.lg),
          i: card.id,
        },
        xs: {
          ...(allLayouts.xs?.find(l => l.i === String(card.id)) ||
            card.layout.xs ||
            card.layout.lg),
          i: card.id,
        },
      },
    }));

    newCards.forEach(card => {
      updateCard(card.id, { layout: card.layout });
    });
  };

  const layouts: GridLayouts = {
    lg: state.cards.map(card => ({ ...card.layout.lg, i: String(card.id) })),
    md: state.cards.map(card => ({
      ...(card.layout.md || card.layout.lg),
      i: String(card.id),
    })),
    sm: state.cards.map(card => ({
      ...(card.layout.sm || card.layout.lg),
      i: String(card.id),
    })),
    xs: state.cards.map(card => ({
      ...(card.layout.xs || card.layout.lg),
      i: String(card.id),
    })),
  };

  return (
    <div className="p-6">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
      >
        {state.cards.map(card => (
          <div key={String(card.id)}>
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
