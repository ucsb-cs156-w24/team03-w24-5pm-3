import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from 'main/components/UCSBOrganization/UCSBOrganizationForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({storybook=false}) {
    let { orgCode } = useParams();
    
    const { data: ucsbOrganization, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/ucsborganizations?orgCode=${orgCode}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/ucsborganizations`,
                params: {
                    code: orgCode
                }
            }
        );

    const objectToAxiosPutParams = (ucsbOrganization) => ({
        url: "/api/ucsborganizations",
        method: "PUT",
        params: {
            code: ucsbOrganization.orgCode,
            
        },
        data: {
            orgCode: ucsbOrganization.orgCode,
            orgTranslationShort: ucsbOrganization.orgTranslationShort,
            orgTranslation: ucsbOrganization.orgTranslation,
            inactive: ucsbOrganization.inactive,
        }
    });

    const onSuccess = (ucsbOrganization) => {
        toast(`UCSBOrganization Updated - orgCode: ${ucsbOrganization.orgCode} orgTranslationShort: ${ucsbOrganization.orgTranslationShort} orgTranslation: ${ucsbOrganization.orgTranslation} inactive: ${ucsbOrganization.inactive}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/ucsborganizations?orgCode=${orgCode}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/ucsborganizations" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit UCSBOrganization</h1>
                {
                    ucsbOrganization && <UCSBOrganizationForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={ucsbOrganization} />
                }
            </div>
        </BasicLayout>
    )

}