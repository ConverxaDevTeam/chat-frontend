import {
  FunctionTemplate,
  FunctionTemplateApplication,
  FunctionTemplateCategory,
  CreateFunctionTemplateDto,
  UpdateFunctionTemplateDto,
  FunctionTemplateParam,
  FunctionTemplateParamType,
} from "@interfaces/template.interface";

// Mock data para usar temporalmente
const mockCategories: FunctionTemplateCategory[] = [
  { id: 1, name: "E-commerce", description: "Plantillas para tiendas online" },
  { id: 2, name: "CRM", description: "Plantillas para gestión de clientes" },
  { id: 3, name: "ERP", description: "Plantillas para gestión empresarial" },
  {
    id: 4,
    name: "Marketing",
    description: "Plantillas para campañas de marketing",
  },
];

const mockApplications: FunctionTemplateApplication[] = [
  {
    id: 1,
    name: "Shopify",
    description: "Plataforma de comercio electrónico",
    image: "/demo/app-icons/shopify.png",
    domain: "myshopify.com",
    isDynamicDomain: true,
  },
  {
    id: 2,
    name: "HubSpot",
    description: "Software de CRM",
    image: "/demo/app-icons/hubspot.png",
    domain: "app.hubspot.com",
    isDynamicDomain: false,
  },
  {
    id: 3,
    name: "Salesforce",
    description: "Plataforma CRM",
    image: "/demo/app-icons/salesforce.png",
    domain: "salesforce.com",
    isDynamicDomain: true,
  },
  {
    id: 4,
    name: "SAP",
    description: "Sistema ERP",
    image: "/demo/app-icons/sap.png",
    domain: "sap.com",
    isDynamicDomain: false,
  },
];

const mockParams: FunctionTemplateParam[] = [
  {
    id: "1",
    name: "api_key",
    title: "API Key",
    description: "Clave de API para autenticación",
    type: FunctionTemplateParamType.STRING,
    required: true,
  },
  {
    id: "2",
    name: "store_name",
    title: "Nombre de la Tienda",
    description: "Nombre de la tienda en Shopify",
    type: FunctionTemplateParamType.STRING,
    required: true,
  },
  {
    id: "3",
    name: "environment",
    title: "Entorno",
    description: "Entorno de trabajo (producción o pruebas)",
    type: FunctionTemplateParamType.ENUM,
    enumValues: ["production", "development", "testing"],
    required: true,
    defaultValue: "development",
  },
  {
    id: "4",
    name: "include_orders",
    title: "Incluir Órdenes",
    description: "Incluir información de órdenes en las consultas",
    type: FunctionTemplateParamType.BOOLEAN,
    required: false,
    defaultValue: true,
  },
];

// Mock data inicial para templates
const mockTemplates: FunctionTemplate[] = [
  {
    id: 1,
    name: "Shopify - Productos",
    description: "Obtener productos desde Shopify",
    categoryId: 1,
    category: mockCategories[0],
    applicationId: 1,
    application: mockApplications[0],
    tags: ["ecommerce", "productos", "inventario"],
    authenticatorId: 2,
    url: "https://{store_name}.myshopify.com/admin/api/2023-01/products.json",
    params: [mockParams[0], mockParams[1], mockParams[3]],
    organizationId: 1,
  },
  {
    id: 2,
    name: "HubSpot - Contactos",
    description: "Gestionar contactos en HubSpot",
    categoryId: 2,
    category: mockCategories[1],
    applicationId: 2,
    application: mockApplications[1],
    tags: ["crm", "contactos", "clientes"],
    authenticatorId: 1,
    url: "https://api.hubspot.com/crm/v3/objects/contacts",
    params: [mockParams[0], mockParams[2]],
    organizationId: 1,
  },
];

let templates = [...mockTemplates];
let nextTemplateId = templates.length + 1;

export const functionTemplateService = {
  // Obtener todos los templates
  getTemplates: async (organizationId: number): Promise<FunctionTemplate[]> => {
    return templates
      .filter(t => t.organizationId === organizationId)
      .map(template => {
        // Asegurarse de que cada template tenga los objetos completos de categoría y aplicación
        const category =
          template.category ||
          (template.categoryId
            ? mockCategories.find(c => c.id === Number(template.categoryId))
            : undefined);

        const application =
          template.application ||
          (template.applicationId
            ? mockApplications.find(
                a => a.id === Number(template.applicationId)
              )
            : undefined);

        return {
          ...template,
          category,
          application,
        };
      });
  },

  // Obtener un template por ID
  getTemplateById: async (id: number): Promise<FunctionTemplate | null> => {
    const template = templates.find(t => t.id === id);
    return template || null;
  },

  // Crear un template
  createTemplate: async (
    template: CreateFunctionTemplateDto
  ): Promise<FunctionTemplate> => {
    const category = mockCategories.find(c => c.id === template.categoryId);
    const application = mockApplications.find(
      a => a.id === template.applicationId
    );

    const newTemplate: FunctionTemplate = {
      ...template,
      id: nextTemplateId++,
      category,
      application,
    };

    templates.push(newTemplate);
    return newTemplate;
  },

  // Actualizar un template
  updateTemplate: async (
    id: number,
    updateData: UpdateFunctionTemplateDto
  ): Promise<FunctionTemplate | null> => {
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updatedTemplate: FunctionTemplate = {
      ...templates[index],
      ...updateData,
    };

    // Actualizar category y application si fueron modificados
    if (updateData.categoryId) {
      updatedTemplate.category = mockCategories.find(
        c => c.id === updateData.categoryId
      );
    }

    if (updateData.applicationId) {
      updatedTemplate.application = mockApplications.find(
        a => a.id === updateData.applicationId
      );
    }

    templates[index] = updatedTemplate;
    return updatedTemplate;
  },

  // Eliminar un template
  deleteTemplate: async (id: number): Promise<boolean> => {
    const initialLength = templates.length;
    templates = templates.filter(t => t.id !== id);
    return initialLength > templates.length;
  },

  // Obtener categorías
  getCategories: async (): Promise<FunctionTemplateCategory[]> => {
    return mockCategories;
  },

  // Obtener aplicaciones
  getApplications: async (): Promise<FunctionTemplateApplication[]> => {
    return mockApplications;
  },

  // Crear una categoría (para futuro backend)
  createCategory: async (
    category: Omit<FunctionTemplateCategory, "id">
  ): Promise<FunctionTemplateCategory> => {
    const newCategory: FunctionTemplateCategory = {
      ...category,
      id: mockCategories.length + 1,
    };
    mockCategories.push(newCategory);
    return newCategory;
  },

  // Crear una aplicación (para futuro backend)
  createApplication: async (
    application: Omit<FunctionTemplateApplication, "id">
  ): Promise<FunctionTemplateApplication> => {
    const newApplication: FunctionTemplateApplication = {
      ...application,
      id: mockApplications.length + 1,
    };
    mockApplications.push(newApplication);
    return newApplication;
  },
};
