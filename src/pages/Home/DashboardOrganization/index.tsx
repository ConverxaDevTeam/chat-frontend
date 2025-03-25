import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { StatisticsCard } from "../../../components/StatisticsCard";
import { useDashboard } from "../../../hooks/useDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useMemo, useState, useRef, useEffect } from "react";
import {
  AnalyticType,
  StatisticsDisplayType,
  TimeRange,
} from "../../../services/analyticTypes";
import { Button } from "@components/common/Button";

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

const DEFAULT_CARD = {
  title: "Nueva tarjeta",
  analyticTypes: [AnalyticType.TOTAL_USERS],
  displayType: StatisticsDisplayType.METRIC,
  timeRange: TimeRange.LAST_7_DAYS,
  showLegend: true,
  layout: {
    lg: {
      h: 8,
      i: 0,
      w: 12,
      x: 0,
      y: 23,
    },
    md: {
      h: 5,
      i: 0,
      w: 7,
      x: 0,
      y: 18,
    },
    sm: {
      h: 4,
      i: 0,
      w: 5,
      x: 0,
      y: 7,
    },
    xs: {
      h: 4,
      i: 0,
      w: 12,
      x: 0,
      y: 4,
    },
  },
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
    addCard,
    removeCard,
  } = useDashboard(organizationId);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    getBreakpoint(window.innerWidth)
  );
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tarjetaAgregada, setTarjetaAgregada] = useState(false);

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

  const handleAddCard = () => {
    const roleId = roles.find(
      org => org.organization?.id === organizationId
    )?.id;
    if (!roleId || !organizationId) return;

    // Calcular la posición Y para la nueva tarjeta
    const maxY =
      state.length > 0
        ? Math.max(...state.map(card => card.layout.lg.y + card.layout.lg.h))
        : 0;
    
    const newCard = {
      ...DEFAULT_CARD,
      layout: {
        lg: { ...DEFAULT_CARD.layout.lg, y: maxY, i: 0 },
      },
    };

    addCard(newCard);
    setTarjetaAgregada(true);
  };
  
  useEffect(() => {
    if (tarjetaAgregada && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth'
        });
        
        setTarjetaAgregada(false);
      }, 200);
    }
  }, [tarjetaAgregada, state.length]);

  return (
    <div className="h-full overflow-auto" ref={containerRef}>
      <Button variant="primary" onClick={handleAddCard} className="w-[161px] h-[40px] flex items-center gap-1 px-4 py-2 bg-[#001130] text-white rounded-lg hover:bg-opacity-90">
        + Crear tarjeta
      </Button>
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
              onDeleteCard={removeCard}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardOrganization;
