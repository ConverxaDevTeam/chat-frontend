import { FaUsers, FaComments, FaRobot } from "react-icons/fa";
import { StatisticsCard } from "../../../components/StatisticsCard";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: "users", x: 0, y: 0, w: 3, h: 2 },
    { i: "iaMessages", x: 3, y: 0, w: 3, h: 2 },
    { i: "htlMessages", x: 6, y: 0, w: 3, h: 2 },
    { i: "sessions", x: 9, y: 0, w: 3, h: 2 },
  ],
  md: [
    { i: "users", x: 0, y: 0, w: 4, h: 2 },
    { i: "iaMessages", x: 4, y: 0, w: 4, h: 2 },
    { i: "htlMessages", x: 0, y: 2, w: 4, h: 2 },
    { i: "sessions", x: 4, y: 2, w: 4, h: 2 },
  ],
  sm: [
    { i: "users", x: 0, y: 0, w: 6, h: 2 },
    { i: "iaMessages", x: 6, y: 0, w: 6, h: 2 },
    { i: "htlMessages", x: 0, y: 2, w: 6, h: 2 },
    { i: "sessions", x: 6, y: 2, w: 6, h: 2 },
  ],
  xs: [
    { i: "users", x: 0, y: 0, w: 12, h: 2 },
    { i: "iaMessages", x: 0, y: 2, w: 12, h: 2 },
    { i: "htlMessages", x: 0, y: 4, w: 12, h: 2 },
    { i: "sessions", x: 0, y: 6, w: 12, h: 2 },
  ],
};

const DashboardOrganization = () => {
  const [layouts, setLayouts] = useLocalStorage(
    "dashboardLayouts",
    defaultLayouts
  );

  const onLayoutChange = (_: any, allLayouts: any) => {
    setLayouts(allLayouts);
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
        <div key="users" className="bg-white rounded-lg shadow-sm">
          <StatisticsCard
            id="users"
            defaultTitle="Usuarios totales"
            value="35"
            icon={<FaUsers size={20} />}
            trend={{ value: 12, isPositive: true }}
            className="h-full"
          />
        </div>
        <div key="iaMessages" className="bg-white rounded-lg shadow-sm">
          <StatisticsCard
            id="iaMessages"
            defaultTitle="Mensajes IA por sesión"
            value="87"
            icon={<FaRobot size={20} />}
            className="h-full"
          />
        </div>
        <div key="htlMessages" className="bg-white rounded-lg shadow-sm">
          <StatisticsCard
            id="htlMessages"
            defaultTitle="Mensajes HTL por sesión"
            value="245"
            icon={<FaComments size={20} />}
            className="h-full"
          />
        </div>
        <div key="sessions" className="bg-white rounded-lg shadow-sm">
          <StatisticsCard
            id="sessions"
            defaultTitle="Sesiones por usuario"
            value="267"
            icon={<FaUsers size={20} />}
            trend={{ value: 5, isPositive: false }}
            className="h-full"
          />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardOrganization;
