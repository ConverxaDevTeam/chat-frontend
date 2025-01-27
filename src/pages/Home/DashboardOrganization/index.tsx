import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { StatisticsCard } from "../../../components/StatisticsCard";
import { useDashboard } from "../../../hooks/useDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useMemo } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardOrganization = () => {
  const organizationId = useSelector(
    (state: RootState) => state.auth.selectOrganizationId
  );

  const { state, updateLayouts } = useDashboard(organizationId);

  // @ts-expect-error - Los tipos de @types/react-grid-layout están desactualizados
  const layouts: Layouts = useMemo(() => {
    return {
      lg: state.map(card => ({ ...card.layout.lg, i: String(card.id) })),
      md: state
        .map(
          card => card.layout.md && { ...card.layout.md, i: String(card.id) }
        )
        .filter(Boolean),
      sm: state
        .map(
          card => card.layout.sm && { ...card.layout.sm, i: String(card.id) }
        )
        .filter(Boolean),
      xs: state
        .map(
          card => card.layout.xs && { ...card.layout.xs, i: String(card.id) }
        )
        .filter(Boolean),
    };
  }, [state]);

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    if (!currentLayout?.length || !allLayouts) return;

    const width = window.innerWidth;
    const breakpoint =
      width >= 1200 ? "lg" : width >= 996 ? "md" : width >= 768 ? "sm" : "xs";

    const movedCard = currentLayout.find((layout, i) => {
      const card = state[i];
      const cardLayout = card?.layout[breakpoint] || card?.layout.lg;
      return (
        card &&
        cardLayout &&
        (layout.x !== cardLayout.x ||
          layout.y !== cardLayout.y ||
          layout.w !== cardLayout.w ||
          layout.h !== cardLayout.h)
      );
    });

    if (movedCard) {
      const cardId = Number(movedCard.i);
      const newLayouts = { ...layouts };
      newLayouts[breakpoint] = currentLayout;
      // @ts-expect-error - Los tipos de @types/react-grid-layout están desactualizados
      updateLayouts(cardId, newLayouts);
    }
  };

  return (
    <div className="p-4 h-full">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 36, md: 30, sm: 18, xs: 12 }}
        rowHeight={30}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        isResizable
        isDraggable
        useCSSTransforms
        onLayoutChange={handleLayoutChange}
      >
        {state.map(card => (
          <div key={String(card.id)}>
            <StatisticsCard {...card} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardOrganization;
