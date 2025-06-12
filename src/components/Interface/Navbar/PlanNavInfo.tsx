import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { OrganizationType } from "@interfaces/organization.interface";

const PlanNavInfo: React.FC = () => {
    const { myOrganizations, selectOrganizationId } = useSelector(
        (state: RootState) => state.auth
    );

    if (!myOrganizations || !selectOrganizationId) {
        return null;
    }

    const selectedUserOrg = myOrganizations.find(
        (userOrg) => userOrg.organization && userOrg.organization.id === selectOrganizationId
    );

    if (!selectedUserOrg || !selectedUserOrg.organization) {
        return null;
    }

    const org = selectedUserOrg.organization;
    const { type, limitInfo } = org;

    let planText = "";

    if (type === OrganizationType.FREE) {
        planText = `${limitInfo?.current || 0}/${limitInfo?.limit} conversaciones`;
        if (limitInfo?.daysRemaining !== undefined && limitInfo.daysRemaining > 0) {
            planText += ` (${limitInfo.daysRemaining} días)`;
        }
    } else if (type === OrganizationType.MVP) {
        planText = "Conversaciones ilimitadas";
    } else if (type === OrganizationType.PRODUCTION) {
        planText = "Conversaciones ilimitadas";
    } else if (type === OrganizationType.CUSTOM) {
        planText = `${limitInfo?.current || 0}/${limitInfo?.limit} conversaciones`;
    } else {
        planText = "Plan no definido";
    }

    return planText;
};

export default PlanNavInfo;
