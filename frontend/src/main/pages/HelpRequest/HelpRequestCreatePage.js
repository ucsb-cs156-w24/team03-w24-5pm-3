import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (helpRequest) => ({
    url: "/api/helprequests/post",
    method: "POST",
    params: {
     requesterEmail: helpRequest.requesterEmail,
     teamId: helpRequest.teamId,
     tableOrBreakoutRoom: helpRequest.tableOrBreakoutRoom,
     requestTime: helpRequest.requestTime,
     explanation: helpRequest.explanation,
     solved: helpRequest.solved
    }
  });

  const onSuccess = (helpRequest) => {
    toast(`New Help Request Created - id: ${helpRequest.id} requesterEmail: ${helpRequest.requesterEmail} teamId: ${helpRequest.teamId} tableOrBreakoutRoom: ${helpRequest.tableOrBreakoutRoom} requestTime: ${helpRequest.requestTime} explanation: ${helpRequest.explanation} solved: ${helpRequest.solved}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/helprequests/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequest" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Help Request</h1>
        <HelpRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}