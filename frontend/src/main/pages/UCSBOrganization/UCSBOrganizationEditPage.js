import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from 'main/components/UCSBOrganization/UCSBOrganizationEditForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RestaurantEditPage({storybook=false}) {
    let { orgCode } = useParams();

    const { data: organization, _error, _status } =
        useBackend(
            [`/api/UCSBOrganization?orgCode=${orgCode}`],
            {  
                method: "GET",
                url: `/api/UCSBOrganization`,
                params: {
                    orgCode
                }
            }
        );

    const objectToAxiosPutParams = (organization) => ({
        url: "/api/UCSBOrganization",
        method: "PUT",
        params: {
            orgCode: organization.orgCode,
        },
        data: {
            orgTranslationShort: organization.orgTranslationShort,
            orgTranslation: organization.orgTranslation,
            inactive: organization.inactive,
        }
    });

    const onSuccess = (organization) => {
        toast(`Organization Updated - orgCode: ${organization.orgCode} orgTranslationShort: ${organization.orgTranslationShort}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        [`/api/UCSBOrganization?orgCode=${orgCode}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/UCSBOrganization" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Organization</h1>
                {
                    organization && <UCSBOrganizationForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={organization} />
                }
            </div>
        </BasicLayout>
    )

}