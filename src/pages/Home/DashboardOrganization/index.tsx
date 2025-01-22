import { FaUsers, FaComments, FaRobot } from "react-icons/fa";
import { StatisticsCard } from "../../../components/StatisticsCard";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useEffect, useState } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: "users", x: 0, y: 0, w: 3, h: 1 },
    { i: "iaMessages", x: 3, y: 0, w: 3, h: 1 },
    { i: "htlMessages", x: 6, y: 0, w: 3, h: 1 },
    { i: "sessions", x: 9, y: 0, w: 3, h: 1 },
  ],
  md: [
    { i: "users", x: 0, y: 0, w: 4, h: 1 },
    { i: "iaMessages", x: 4, y: 0, w: 4, h: 1 },
    { i: "htlMessages", x: 0, y: 1, w: 4, h: 1 },
    { i: "sessions", x: 4, y: 1, w: 4, h: 1 },
  ],
  sm: [
    { i: "users", x: 0, y: 0, w: 6, h: 1 },
    { i: "iaMessages", x: 6, y: 0, w: 6, h: 1 },
    { i: "htlMessages", x: 0, y: 1, w: 6, h: 1 },
    { i: "sessions", x: 6, y: 1, w: 6, h: 1 },
  ],
  xs: [
    { i: "users", x: 0, y: 0, w: 12, h: 1 },
    { i: "iaMessages", x: 0, y: 1, w: 12, h: 1 },
    { i: "htlMessages", x: 0, y: 2, w: 12, h: 1 },
    { i: "sessions", x: 0, y: 3, w: 12, h: 1 },
  ],
};

const DashboardOrganization = () => {
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem("dashboardLayouts");
    return savedLayouts ? JSON.parse(savedLayouts) : defaultLayouts;
  });

  useEffect(() => {
    const savedLayouts = localStorage.getItem("dashboardLayouts");
    if (savedLayouts) {
      setLayouts(JSON.parse(savedLayouts));
    }
  }, []);

  const onLayoutChange = (_: any, allLayouts: any) => {
    localStorage.setItem("dashboardLayouts", JSON.stringify(allLayouts));
    setLayouts(allLayouts);
  };

  return (
    <div className="p-6">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 8, sm: 12, xs: 12 }}
        rowHeight={150}
        onLayoutChange={onLayoutChange}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
      >
        <div key="users" className="bg-white rounded-lg shadow-sm">
          <StatisticsCard
            title="Usuarios totales"
            value="35"
            icon={<FaUsers size={20} />}
            trend={{ value: 12, isPositive: true }}
            className="h-full"
          />
        </div>
        <div key="iaMessages" className="bg-white rounded-lg shadow-sm">
          <StatisticsCard
            title="Mensajes IA por sesión"
            value="87"
            icon={<FaRobot size={20} />}
            className="h-full"
          />
        </div>
        <div key="htlMessages" className="bg-white rounded-lg shadow-sm">
          <StatisticsCard
            title="Mensajes HTL por sesión"
            value="245"
            icon={<FaComments size={20} />}
            className="h-full"
          />
        </div>
        <div key="sessions" className="bg-white rounded-lg shadow-sm">
          <StatisticsCard
            title="Sesiones por usuario"
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
