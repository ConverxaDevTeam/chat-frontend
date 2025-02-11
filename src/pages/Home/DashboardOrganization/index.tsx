import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { StatisticsCard } from "../../../components/StatisticsCard";
import { useDashboard } from "../../../hooks/useDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useMemo, useState } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);

const BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
} as const;

const COLS = {
  lg: 36,
  md: 30,
  sm: 18,
  xs: 12,
} as const;

const getBreakpoint = (width: number) => {
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
};

const DashboardOrganization = () => {
  const organizationId = useSelector(
    (state: RootState) => state.auth.selectOrganizationId
  );
  const roles = useSelector((state: RootState) => state.auth.myOrganizations);

  const {
    state,
    updateLayouts,
    updateCard: updateCardService,
  } = useDashboard(organizationId);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    getBreakpoint(window.innerWidth)
  );

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

  const handleItemChange = (layout: Layout[]) => {
    const roleId = roles.find(
      org => org.organization?.id === organizationId
    )?.id;
    if (!roleId) return;
    updateLayouts(layout, currentBreakpoint, roleId);
  };

  return (
    <div className="p-4 h-full">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={35}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        isResizable
        isDraggable
        useCSSTransforms
        onDragStop={handleItemChange}
        onResizeStop={handleItemChange}
        onBreakpointChange={setCurrentBreakpoint}
      >
        {state.map(card => (
          <div key={card.id}>
            <StatisticsCard
              id={card.id}
              title={card.title}
              analyticTypes={card.analyticTypes}
              displayType={card.displayType}
              timeRange={card.timeRange}
              className="h-full"
              showLegend={card.showLegend}
              onUpdateCard={updates => updateCardService(card.id, updates)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardOrganization;
