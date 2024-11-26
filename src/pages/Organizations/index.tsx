import Loading from "@components/Loading";
import Modal from "@components/Modal";
import { getOrganizations } from "@services/organizations";
import { useEffect, useState } from "react";
import OrganizationCard from "./UserCard";
import ModalCreateOrganization from "./ModalCreateUser";

export type IOrganizarion = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
};

const Organizations = () => {
  const [organizations, setOrganizations] = useState<IOrganizarion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalCreateOrganizationOpen, setIsModalCreateOrganizationOpen] =
    useState(false);

  const getAllOrganizations = async () => {
    try {
      const response = await getOrganizations();
      if (response) {
        setOrganizations(response);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrganizations();
  }, []);

  return (
    <>
      <Modal
        isShown={isModalCreateOrganizationOpen}
        children={<p>ssss</p>}
        onClose={() => setIsModalCreateOrganizationOpen(false)}
        header={
          <ModalCreateOrganization
            getAllOrganizations={getAllOrganizations}
            close={() => setIsModalCreateOrganizationOpen(false)}
          />
        }
        footer={<button type="button">Crear</button>}
      />
      <div className="flex flex-1 flex-col gap-[20px] overflow-auto w-full py-[20px]">
        <button
          type="button"
          onClick={() => setIsModalCreateOrganizationOpen(true)}
          className="w-[190px] h-[40px] border-[1px] rounded-full text-[16px] ml-auto leading-[24px] font-poppinsMedium bg-app-dark text-white"
        >
          Crear Organización
        </button>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[20px] 2xl:gap-[24px]">
            {organizations.map(organization => {
              return (
                <OrganizationCard
                  key={organization.id}
                  organization={organization}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Organizations;
