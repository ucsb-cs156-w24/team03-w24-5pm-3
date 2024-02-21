import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationCreatePage({storybook=false}) {

  const objectToAxiosParams = (organization) => ({
    url: "/api/UCSBOrganization/post",
    method: "POST",
    params: {
     orgCode: organization.orgCode,
     orgTranslationShort: organization.orgTranslationShort,
     orgTranslation: organization.orgTranslation,
     inactive: organization.inactive
    }
  });

  const onSuccess = (organization) => {
    toast(`New organization Created - orgCode: ${organization.orgCode}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
      // Stryker disable next-line all : hard to set up test for caching

     ["/api/UCSBOrganization/all"] 
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
        <h1>Create New Organization</h1>
        <UCSBOrganizationForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}